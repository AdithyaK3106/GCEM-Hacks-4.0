// ============================================================
// /types/audio.ts — Shared Audio Contracts
// ============================================================

export interface CalibrationProfile {
  rmsEnergy: number;       // Root Mean Square energy (0–1)
  peakAmplitude: number;   // Max peak amplitude (0–1)
  noiseFloor: number;      // Estimated background noise floor (0–1)
  gainFactor: number;      // Recommended gain multiplier
  capturedAt: number;      // Unix timestamp ms
}

export interface AudioChunk {
  sessionId: string;
  chunkIndex: number;
  pcmData: Float32Array;   // Raw 32-bit float PCM samples
  sampleRate: number;
  timestamp: number;
}

export interface AudioMetrics {
  signalEnergy: number;    // RMS of clean signal
  noiseEnergy: number;     // Estimated noise energy
  clarity: number;         // signalEnergy / noiseEnergy (0–2+)
  level: 'clear' | 'noisy' | 'silent';
}

export type NoiseFilterStrategy = 'basic' | 'rnnoise';

export interface RecorderOptions {
  sampleRate?: number;           // Default 16000 Hz
  chunkIntervalMs?: number;      // Default 200ms
  noiseStrategy?: NoiseFilterStrategy;
  calibration?: CalibrationProfile;
  onChunk?: (chunk: AudioChunk) => void;
  onMetrics?: (metrics: AudioMetrics) => void;
  onError?: (err: Error) => void;
}

export interface RecorderState {
  isRecording: boolean;
  isCalibrating: boolean;
  calibration: CalibrationProfile | null;
  currentMetrics: AudioMetrics | null;
}
