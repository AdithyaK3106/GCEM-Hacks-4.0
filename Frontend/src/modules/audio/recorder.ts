// ============================================================
// /modules/audio/recorder.ts
// Single responsibility: capture microphone audio in real-time
// chunks using AudioWorklet, apply gain + noise filter,
// and fire onChunk + onMetrics callbacks.
// ============================================================

import type { AudioChunk, AudioMetrics, RecorderOptions } from '../../types/audio';
import { applyNoiseFilter } from './noiseFilter';
import { createGainController, type GainController } from './gainControl';

const SAMPLE_RATE = 16000;
const DEFAULT_CHUNK_INTERVAL_MS = 200;

// Inline AudioWorklet processor script (injected as Blob URL)
const WORKLET_CODE = `
class ChunkProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    this._buffer = [];
    this._samplesPerChunk = options.processorOptions?.samplesPerChunk ?? 3200;
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;
    for (let i = 0; i < channel.length; i++) {
      this._buffer.push(channel[i]);
    }
    while (this._buffer.length >= this._samplesPerChunk) {
      const chunk = this._buffer.splice(0, this._samplesPerChunk);
      this.port.postMessage({ pcm: new Float32Array(chunk) }, [new Float32Array(chunk).buffer]);
    }
    return true;
  }
}
registerProcessor('chunk-processor', ChunkProcessor);
`;

function computeRMS(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
  return Math.sqrt(sum / samples.length);
}

function deriveMetrics(rms: number, noiseFloor: number): AudioMetrics {
  const noiseEnergy = Math.max(noiseFloor, 0.001);
  const signalEnergy = Math.max(rms - noiseFloor, 0.001);
  const clarity = Math.min(signalEnergy / noiseEnergy, 2);
  const level: AudioMetrics['level'] =
    rms < 0.01 ? 'silent' : clarity > 0.5 ? 'clear' : 'noisy';
  return { signalEnergy, noiseEnergy, clarity, level };
}

export interface Recorder {
  start(sessionId: string): Promise<void>;
  stop(): void;
  isActive(): boolean;
}

/**
 * Create a Recorder instance.
 * Call start(sessionId) to begin recording.
 * Call stop() to end and release resources.
 */
export function createRecorder(options: RecorderOptions = {}): Recorder {
  const {
    sampleRate = SAMPLE_RATE,
    chunkIntervalMs = DEFAULT_CHUNK_INTERVAL_MS,
    noiseStrategy = 'basic',
    calibration,
    onChunk,
    onMetrics,
    onError,
  } = options;

  let ctx: AudioContext | null = null;
  let stream: MediaStream | null = null;
  let gainCtrl: GainController | null = null;
  let active = false;
  let chunkIndex = 0;

  return {
    async start(sessionId: string) {
      if (active) return;
      active = true;
      chunkIndex = 0;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate,
            echoCancellation: true,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });

        ctx = new AudioContext({ sampleRate });

        // Register worklet
        const samplesPerChunk = Math.floor((sampleRate * chunkIntervalMs) / 1000);
        const blob = new Blob([WORKLET_CODE], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        await ctx.audioWorklet.addModule(blobUrl);
        URL.revokeObjectURL(blobUrl);

        // Build graph: source → gainNode → noiseFilter → worklet
        const source = ctx.createMediaStreamSource(stream);
        gainCtrl = createGainController(ctx, calibration);

        const worklet = new AudioWorkletNode(ctx, 'chunk-processor', {
          processorOptions: { samplesPerChunk },
          numberOfOutputs: 0,
        });

        // Apply noise filter between gain and worklet
        await applyNoiseFilter(ctx, gainCtrl.gainNode, worklet, noiseStrategy);
        source.connect(gainCtrl.gainNode);

        worklet.port.onmessage = (e: MessageEvent) => {
          const pcm: Float32Array = e.data.pcm;
          const rms = computeRMS(pcm);
          const noiseFloor = calibration?.noiseFloor ?? 0.02;

          // Update gain controller with current RMS
          gainCtrl?.updateFromRMS(rms);

          // Fire onMetrics
          if (onMetrics) {
            onMetrics(deriveMetrics(rms, noiseFloor));
          }

          // Fire onChunk
          if (onChunk) {
            const chunk: AudioChunk = {
              sessionId,
              chunkIndex: chunkIndex++,
              pcmData: pcm,
              sampleRate,
              timestamp: Date.now(),
            };
            onChunk(chunk);
          }
        };
      } catch (err) {
        active = false;
        onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    },

    stop() {
      active = false;
      gainCtrl?.dispose();
      stream?.getTracks().forEach((t) => t.stop());
      ctx?.close();
      ctx = null;
      stream = null;
      gainCtrl = null;
    },

    isActive() {
      return active;
    },
  };
}
