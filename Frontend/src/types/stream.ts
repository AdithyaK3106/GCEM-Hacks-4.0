// ============================================================
// /types/stream.ts — WebSocket Stream Contracts
// ============================================================

export interface StreamConfig {
  wsUrl: string;             // WebSocket endpoint
  sessionId: string;
  reconnectDelayMs?: number; // Default 2000ms
  maxReconnects?: number;    // Default 5
}

export interface StreamMessage {
  type: 'audio_chunk' | 'control';
  sessionId: string;
  chunkIndex?: number;
  sampleRate?: number;
  payload: ArrayBuffer | string;
}

export interface TranscriptChunk {
  sessionId: string;
  chunkIndex: number;
  text: string;              // Partial transcript text
  isFinal: boolean;
  timestamp: number;
}

export interface MetricsPayload {
  clarity: number;
  level: 'clear' | 'noisy' | 'silent';
  signalEnergy: number;
  noiseEnergy: number;
}

export interface ServerMessage {
  type: 'transcript' | 'metrics' | 'error' | 'ack';
  data: TranscriptChunk | MetricsPayload | { message: string } | null;
}

export type StreamStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';
