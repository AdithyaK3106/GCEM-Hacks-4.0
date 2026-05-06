# ============================================================
# /services/audio_stream.py
# Single responsibility: WebSocket endpoint that receives
# audio chunks, routes them through processor + transcription,
# and emits transcript + metrics back to the client.
# ============================================================

import asyncio
import json
import logging
import struct
import time
from typing import Optional, Dict

import numpy as np
from fastapi import WebSocket, WebSocketDisconnect

from .audio_processor import process_chunk
from .audio_metrics import compute_metrics, ClarityTracker
from .transcription_stream import TranscriptionStream

logger = logging.getLogger(__name__)

# FIX: Track connections by session_id with last_seen + state to prevent leaks and race conditions
active_connections: Dict[str, dict] = {}
MAX_CONNECTIONS = 5

# FIX: Persist transcription objects across WebSocket reconnects
stream_store: Dict[str, TranscriptionStream] = {}

# FIX: Serialise sends to prevent concurrent write crashes
send_locks: Dict[str, asyncio.Lock] = {}

import traceback

async def safe_send(ws: WebSocket, payload: dict, session_id: str):
    # FIX: exception-first safe send (unreliable client_state removed)
    try:
        conn = active_connections.get(session_id)
        if not conn or conn.get("closed"):
            return
        
        # STEP 8: Connection ID check (prevent sending to replaced socket)
        if conn.get("ws") is not ws:
            return

        async with send_locks[session_id]:
            await ws.send_text(json.dumps(payload))

    except Exception as e:
        logger.error(f"[SEND ERROR] {e}")
        if session_id in active_connections:
            active_connections[session_id]["closed"] = True


async def safe_close(ws: WebSocket, session_id: str):
    # FIX: exception-safe close
    try:
        conn = active_connections.get(session_id)
        if conn and conn.get("ws") is ws:
            conn["closed"] = True
        logger.info(f"[WS CLOSED] {session_id}")
        await ws.close()
    except Exception:
        pass


async def cleanup_stale_connections():
    """Background task to remove zombie connections."""
    while True:
        try:
            now = time.time()
            for session_id, conn in list(active_connections.items()):
                # FIX: mark connection as stale instead of closing immediately
                if now - conn["last_seen"] > 15:
                    logger.warning(f"[audio_stream] Cleanup marking stale: {session_id}")
                    conn["stale"] = True
            
            # Note: The main loop in handle_audio_stream will exit when it sees "stale"
        except Exception as e:
            logger.error(f"[audio_stream] Cleanup task error: {e}")
            
        await asyncio.sleep(10)


def _parse_binary_message(data: bytes) -> tuple[dict, bytes]:
    """
    Parse the wire format sent by streamClient.ts:
      [4 bytes: header length (uint32 LE)] [header JSON] [PCM bytes]
    """
    if len(data) < 4:
        raise ValueError("Message too short")
    header_len = struct.unpack_from("<I", data, 0)[0]
    header_end = 4 + header_len
    if header_end > len(data):
        raise ValueError("Header length exceeds message size")
    header = json.loads(data[4:header_end])
    pcm_bytes = data[header_end:]
    return header, pcm_bytes


async def handle_audio_stream(ws: WebSocket) -> None:
    """
    WebSocket handler for /stream-audio with hardened lifecycle management.
    """
    session_id: str = ws.query_params.get("session_id", "unknown")
    connection_closed = False
    
    # FIX: PERSISTENCE - reuse stream if it exists
    if session_id not in stream_store:
        stream_store[session_id] = TranscriptionStream()
    transcription_stream = stream_store[session_id]

    if session_id not in send_locks:
        send_locks[session_id] = asyncio.Lock()

    # FIX: Wrap ENTIRE handler in try/finally to guarantee cleanup
    try:
        logger.info(f"[WS OPEN] session: {session_id}")

        # FIX: Prevent connection overflow (Hard Kill)
        if len(active_connections) >= MAX_CONNECTIONS and session_id not in active_connections:
            logger.warning(f"[audio_stream] Max connections reached. Rejecting {session_id}")
            await ws.accept()
            await safe_send(ws, {"type": "error", "data": {"message": "Stream: max connections reached"}}, session_id)
            await safe_close(ws, session_id)
            connection_closed = True
            return

        # STEP 4: Safe connection replacement
        if session_id in active_connections:
            logger.info(f"[audio_stream] Marking old connection for {session_id} as closed")
            active_connections[session_id]["closed"] = True

        await ws.accept()
        
        # FIX: Initialize per-connection state
        active_connections[session_id] = {
            "ws": ws,
            "last_seen": time.time(),
            "stop_processed": False,
            "stale": False,
            "closed": False,
            "tracker": ClarityTracker() # FIX: track clarity state
        }
        logger.info(f"[audio_stream] Connected: {session_id} | Total Active: {len(active_connections)}")

        chunk_index = 0

        while True:
            # STEP 4: Stop all sends after close
            if active_connections.get(session_id, {}).get("closed"):
                connection_closed = True
                break

            # STEP 11: Heartbeat timeout guard
            conn_entry = active_connections.get(session_id)
            if not conn_entry or time.time() - conn_entry["last_seen"] > 10:
                logger.warning(f"[WS TIMEOUT] {session_id}")
                connection_closed = True
                break

            # FIX: exception-safe receive to avoid loop crash
            try:
                data = await ws.receive()
            except Exception as e:
                logger.error(f"🔥 RECEIVE ERROR: {e}")
                connection_closed = True
                break 

            # Update activity timestamp for ANY incoming message
            if session_id in active_connections:
                active_connections[session_id]["last_seen"] = time.time()

            # FIX: stale handling using break
            if conn_entry and conn_entry.get("stale"):
                logger.info(f"[audio_stream] STALE connection closing: {session_id}")
                connection_closed = True
                break

            if data["type"] == "websocket.disconnect":
                logger.info(f"[audio_stream] Disconnect received for {session_id}")
                connection_closed = True
                break

            # FIX: handle mixed message types safely
            pcm_bytes = None
            if "bytes" in data:
                pcm_bytes = data["bytes"]
            elif "text" in data:
                try:
                    msg = json.loads(data["text"])
                    
                    # Heartbeat (STEP 5: Removed extra ack)
                    if msg.get("type") == "PING":
                        continue
                        
                    # FIX: Idempotent STOP handling
                    if msg.get("type") == "STOP":
                        conn_state = active_connections.get(session_id)
                        if not conn_state or conn_state["stop_processed"]:
                            continue
                        
                        conn_state["stop_processed"] = True
                        logger.info(f"[audio_stream] STOP received for {session_id}")
                        connection_closed = True
                        break
                except Exception as e:
                    logger.warning(f"[audio_stream] Control error: {e}")
                continue
            else:
                continue

            # Process audio chunk...
            try:
                header, pcm_data = _parse_binary_message(pcm_bytes)
                
                sample_rate = header.get("sampleRate", 16000)
                chunk_index = header.get("chunkIndex", chunk_index)

                # FIX: use session-specific tracker for smoothed metrics
                tracker = active_connections[session_id].get("tracker")
                metrics = compute_metrics(pcm_data, sample_width=4, tracker=tracker)
                
                processed = process_chunk(pcm_data, sample_rate=sample_rate, sample_width=4)
                
                if processed is not None:
                    status = transcription_stream.add_chunk(processed)
                    if status == "final":
                        # FIX: Verify transcriber input length
                        logger.info(f"[TRANSCRIBE INPUT LEN] {transcription_stream._buffer_samples}")
                        result = await transcription_stream.transcribe_buffered()
                        
                        if result["text"]:
                            # STEP 2: Use delta directly from result
                            new_text = result["text"]
                            
                            # STEP 12: Small send delay for smoothing
                            await asyncio.sleep(0.05)

                            # STEP 6/9: Combined Update Payload (Only one send)
                            await safe_send(ws, {
                                "type": "update",
                                "data": {
                                    "metrics": metrics,
                                    "text": new_text,
                                    "mode": "delta"
                                }
                            }, session_id)
                            logger.info(f"[DELTA SENT] '{new_text}'")
                    elif status == "preview":
                        preview_text = await transcription_stream.transcribe_preview()
                        # Preview uses partial mode
                        await safe_send(ws, {
                            "type": "update",
                            "data": {
                                "metrics": metrics,
                                "text": preview_text,
                                "mode": "partial"
                            }
                        }, session_id)
                else:
                    # No audio processed, just send metrics (STEP 9: Only one send)
                    await safe_send(ws, {
                        "type": "update",
                        "data": {
                            "metrics": metrics,
                            "text": "",
                            "mode": "none"
                        }
                    }, session_id)

            except Exception as e:
                logger.warning(f"[audio_stream] Processing error: {e}")

    except Exception as e:
        logger.error(f"[audio_stream] Unexpected error in {session_id}: {e}")

    finally:
        logger.info(f"[audio_stream] CLEANUP START: {session_id}")
        
        # FIX: Identity-safe connection check for cleanup
        conn_entry = active_connections.get(session_id)

        # STEP 7: Harden final flush
        if conn_entry and not conn_entry.get("closed") and not conn_entry.get("stale"):
            if transcription_stream._buffer_samples > 0:
                try:
                    logger.info(f"[audio_stream] Final flush for {session_id} ({transcription_stream._buffer_samples} samples)")
                    result = await transcription_stream.transcribe_buffered()
                    if result["text"]:
                        await safe_send(ws, {
                            "type": "final_transcript",
                            "data": {
                                "text": result["text"],
                                "isFinal": True
                            }
                        }, session_id)
                        logger.info(f"[FINAL SENT] {session_id}")
                except Exception as flush_err:
                    logger.warning(f"[audio_stream] Final flush failed: {flush_err}")

        # ALWAYS ensure safe close
        await asyncio.sleep(0.1)
        await safe_close(ws, session_id)

        # FIX: ALWAYS remove from active_connections (identity-safe)
        if conn_entry and conn_entry.get("ws") is ws:
            active_connections.pop(session_id, None)
            # STEP 6: Clean up per-session resources
            stream_store.pop(session_id, None)
            send_locks.pop(session_id, None)
            logger.info(f"[audio_stream] CLEANUP DONE: removed {session_id}")
            
        logger.info(f"[audio_stream] ACTIVE COUNT: {len(active_connections)}")
