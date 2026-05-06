// ============================================================
// /modules/audio/streamClient.ts
// Single responsibility: manage WebSocket connection, send
// audio chunks as binary, receive transcript + metrics events.
// ============================================================

import type { AudioChunk } from '../../types/audio';
import type {
  StreamConfig,
  StreamStatus,
  ServerMessage,
  TranscriptChunk,
  MetricsPayload,
} from '../../types/stream';

export interface StreamClientCallbacks {
  onTranscript?: (chunk: TranscriptChunk) => void;
  onMetrics?: (metrics: MetricsPayload) => void;
  onStatusChange?: (status: StreamStatus) => void;
  onError?: (err: Error) => void;
}

export interface StreamClient {
  connect(): void;
  disconnect(): void;
  stop(): void;
  sendChunk(chunk: AudioChunk): void;
  getStatus(): StreamStatus;
}

/**
 * Create a StreamClient.
 * Handles reconnect with exponential backoff up to maxReconnects.
 * Sends audio chunks as binary ArrayBuffer preceded by a JSON header.
 *
 * Wire format per message:
 *   [4 bytes: header length (uint32 LE)] [header JSON bytes] [PCM bytes]
 */
export function createStreamClient(
  config: StreamConfig,
  callbacks: StreamClientCallbacks = {}
): StreamClient {
  const { wsUrl, sessionId, reconnectDelayMs = 2000, maxReconnects = 5 } = config;
  const { onTranscript, onMetrics, onStatusChange, onError } = callbacks;

  let ws: WebSocket | null = null;
  let status: StreamStatus = 'disconnected';
  let reconnectCount = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let intentionalClose = false;

  function setStatus(s: StreamStatus) {
    status = s;
    onStatusChange?.(s);
  }

  function buildBinaryMessage(chunk: AudioChunk): ArrayBuffer {
    const header = JSON.stringify({
      sessionId: chunk.sessionId,
      chunkIndex: chunk.chunkIndex,
      sampleRate: chunk.sampleRate,
      timestamp: chunk.timestamp,
    });
    const headerBytes = new TextEncoder().encode(header);
    const pcmBytes = new Uint8Array(chunk.pcmData.buffer);

    const buf = new ArrayBuffer(4 + headerBytes.length + pcmBytes.length);
    const view = new DataView(buf);
    view.setUint32(0, headerBytes.length, true); // LE
    new Uint8Array(buf, 4, headerBytes.length).set(headerBytes);
    new Uint8Array(buf, 4 + headerBytes.length).set(pcmBytes);
    return buf;
  }

  function attemptConnect() {
    if (intentionalClose) return;
    setStatus(reconnectCount > 0 ? 'reconnecting' : 'connecting');

    try {
      ws = new WebSocket(`${wsUrl}?session_id=${sessionId}`);
      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        reconnectCount = 0;
        setStatus('connected');
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const msg: ServerMessage = JSON.parse(event.data as string);
          // FIX: Include 'partial' and 'final_transcript' for real-time feel
          if ((msg.type === 'transcript' || msg.type === 'final_transcript' || msg.type === 'partial') && msg.data) {
            const isFinal = msg.type === 'final_transcript';
            onTranscript?.({ ...(msg.data as TranscriptChunk), isFinal });
          } else if (msg.type === 'metrics' && msg.data) {
            onMetrics?.(msg.data as MetricsPayload);
          }
        } catch (e) {
          console.warn('[streamClient] Unreadable server message', e);
        }
      };

      ws.onerror = () => {
        onError?.(new Error('WebSocket error'));
      };

      ws.onclose = () => {
        if (intentionalClose) {
          setStatus('disconnected');
          return;
        }
        if (reconnectCount < maxReconnects) {
          reconnectCount++;
          const delay = reconnectDelayMs * Math.pow(1.5, reconnectCount - 1);
          console.warn(`[streamClient] Connection lost. Reconnecting in ${delay}ms…`);
          setStatus('reconnecting');
          reconnectTimer = setTimeout(attemptConnect, delay);
        } else {
          setStatus('error');
          onError?.(new Error('Max reconnect attempts reached'));
        }
      };
    } catch (err) {
      setStatus('error');
      onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  }

  return {
    connect() {
      intentionalClose = false;
      reconnectCount = 0;
      attemptConnect();
    },

    disconnect() {
      intentionalClose = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
      ws = null;
      setStatus('disconnected');
    },

    stop() {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      console.log('[streamClient] stop() called (sending STOP)');
      ws.send(JSON.stringify({ type: 'STOP' }));
    },

    sendChunk(chunk: AudioChunk) {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      try {
        const buf = buildBinaryMessage(chunk);
        ws.send(buf);
      } catch (e) {
        console.warn('[streamClient] Failed to send chunk', e);
      }
    },

    getStatus() {
      return status;
    },
  };
}
