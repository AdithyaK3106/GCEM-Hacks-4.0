// ============================================================
// /modules/audio/calibration.ts
// Single responsibility: capture a 3–5s sample and derive
// CalibrationProfile (RMS, peak, noise floor, gain factor).
// ============================================================

import type { CalibrationProfile } from '../../types/audio';

const CALIBRATION_DURATION_MS = 4000; // 4 seconds
const SAMPLE_RATE = 16000;
const FFT_SIZE = 2048;

/**
 * Compute RMS energy from a Float32Array of PCM samples.
 */
function computeRMS(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  return Math.sqrt(sum / samples.length);
}

/**
 * Compute peak amplitude from a Float32Array of PCM samples.
 */
function computePeak(samples: Float32Array): number {
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const abs = Math.abs(samples[i]);
    if (abs > peak) peak = abs;
  }
  return peak;
}

/**
 * Derive a recommended gain factor.
 * Target RMS ≈ 0.15 (comfortable speech level).
 * Clamps between 1.0 and 8.0 to prevent extreme amplification.
 */
function deriveGainFactor(rms: number, noiseFloor: number): number {
  const TARGET_RMS = 0.15;
  const cleanRms = Math.max(rms - noiseFloor, 0.001);
  const raw = TARGET_RMS / cleanRms;
  return Math.min(Math.max(raw, 1.0), 8.0);
}

/**
 * Runs a calibration session.
 * Resolves with a CalibrationProfile after CALIBRATION_DURATION_MS.
 * Rejects if microphone access is denied.
 */
export async function runCalibration(): Promise<CalibrationProfile> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      sampleRate: SAMPLE_RATE,
      echoCancellation: true,
      noiseSuppression: false, // we do our own — don't double-process
      autoGainControl: false,
    },
  });

  const ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = FFT_SIZE;
  source.connect(analyser);

  return new Promise((resolve, reject) => {
    const allSamples: number[] = [];
    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);

    const interval = setInterval(() => {
      analyser.getFloatTimeDomainData(buffer);
      allSamples.push(...Array.from(buffer));
    }, 100);

    setTimeout(() => {
      clearInterval(interval);

      // Stop tracks
      stream.getTracks().forEach((t) => t.stop());
      ctx.close();

      if (allSamples.length === 0) {
        reject(new Error('No audio captured during calibration'));
        return;
      }

      const pcm = new Float32Array(allSamples);
      const rmsEnergy = computeRMS(pcm);
      const peakAmplitude = computePeak(pcm);

      // Noise floor: RMS of the quietest 20% of 100-sample windows
      const windowSize = 100;
      const windowRms: number[] = [];
      for (let i = 0; i + windowSize < pcm.length; i += windowSize) {
        windowRms.push(computeRMS(pcm.slice(i, i + windowSize)));
      }
      windowRms.sort((a, b) => a - b);
      const noiseFloor = windowRms[Math.floor(windowRms.length * 0.2)] ?? rmsEnergy * 0.3;

      const gainFactor = deriveGainFactor(rmsEnergy, noiseFloor);

      const profile: CalibrationProfile = {
        rmsEnergy,
        peakAmplitude,
        noiseFloor,
        gainFactor,
        capturedAt: Date.now(),
      };

      // Persist to sessionStorage for reuse within the same tab
      sessionStorage.setItem('audio_calibration', JSON.stringify(profile));

      resolve(profile);
    }, CALIBRATION_DURATION_MS);
  });
}

/**
 * Load a previously stored calibration profile (if any).
 */
export function loadCalibration(): CalibrationProfile | null {
  try {
    const raw = sessionStorage.getItem('audio_calibration');
    return raw ? (JSON.parse(raw) as CalibrationProfile) : null;
  } catch {
    return null;
  }
}

/**
 * Clear stored calibration profile.
 */
export function clearCalibration(): void {
  sessionStorage.removeItem('audio_calibration');
}
