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
from typing import Optional

import numpy as np
from fastapi import WebSocket, WebSocketDisconnect

from .audio_processor import process_chunk
from .audio_metrics import compute_metrics
from .transcription_stream import TranscriptionStream

logger = logging.getLogger(__name__)


def _parse_binary_message(data: bytes) -> tuple[dict, bytes]:
    """
    Parse the wire format sent by streamClient.ts:
      [4 bytes: header length (uint32 LE)] [header JSON] [PCM bytes]

    Returns:
        (header dict, pcm_bytes)
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


async def _send_json(ws: WebSocket, payload: dict) -> None:
    """Send a JSON message; ignore closed connection errors."""
    try:
        await ws.send_text(json.dumps(payload))
    except Exception:
        pass  # Connection may have closed


async def handle_audio_stream(ws: WebSocket) -> None:
    """
    WebSocket handler for /stream-audio.
    Register in main.py:
        @app.websocket("/stream-audio")
        async def stream_audio(ws: WebSocket):
            await handle_audio_stream(ws)
    """
    session_id: Optional[str] = ws.query_params.get("session_id", "unknown")
    await ws.accept()
    logger.info(f"[audio_stream] Connected: {session_id}")

    transcription_stream = TranscriptionStream()
    chunk_index = 0

    try:
        while True:
            data = await ws.receive_bytes()

            # ── 1. Parse incoming binary chunk ──────────────────────
            try:
                header, pcm_bytes = _parse_binary_message(data)
            except Exception as e:
                logger.warning(f"[audio_stream] Parse error: {e}")
                await _send_json(ws, {"type": "error", "data": {"message": str(e)}})
                continue

            sample_rate = header.get("sampleRate", 16000)
            chunk_index = header.get("chunkIndex", chunk_index)
            logger.info(f"[audio_stream] chunk#{chunk_index} pcm_bytes={len(pcm_bytes)} sample_rate={sample_rate}")

            # ── 2. Compute metrics (lightweight — always runs) ──────
            metrics = compute_metrics(pcm_bytes, sample_width=4)
            await _send_json(ws, {"type": "metrics", "data": metrics})

            # ── 3. Process: normalise + silence gate ────────────────
            processed = process_chunk(pcm_bytes, sample_rate=sample_rate, sample_width=4)
            if processed is None:
                logger.info(f"[audio_stream] chunk#{chunk_index} → SILENT, skipped")
                # Silent chunk — ack and continue
                await _send_json(ws, {"type": "ack", "data": None})
                continue
            logger.info(f"[audio_stream] chunk#{chunk_index} → {len(processed)} samples passed silence gate")

            # ── 4. Transcription buffer ─────────────────────────────
            ready = transcription_stream.add_chunk(processed)

            if ready:
                logger.info(f"[audio_stream] Buffer full ({transcription_stream._buffer_samples} samples), transcribing...")
                # Buffer full → transcribe
                result = await transcription_stream.transcribe_buffered()
                logger.info(f"[audio_stream] Transcription result: '{result['text']}'")
                if result["text"]:
                    await _send_json(ws, {
                        "type": "transcript",
                        "data": {
                            "sessionId": session_id,
                            "chunkIndex": chunk_index,
                            "text": result["text"],
                            "isFinal": result["is_final"],
                            "timestamp": asyncio.get_event_loop().time(),
                        }
                    })
            else:
                await _send_json(ws, {"type": "ack", "data": None})

    except WebSocketDisconnect:
        logger.info(f"[audio_stream] Disconnected: {session_id}")

        # Flush remaining buffer on disconnect
        if transcription_stream._buffer_samples > 0:
            result = await transcription_stream.transcribe_buffered()
            if result["text"]:
                logger.info(f"[audio_stream] Final flush: {result['text'][:60]}…")

    except Exception as e:
        logger.error(f"[audio_stream] Unexpected error: {e}", exc_info=True)
        await _send_json(ws, {"type": "error", "data": {"message": str(e)}})
