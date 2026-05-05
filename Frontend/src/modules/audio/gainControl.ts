// ============================================================
// /modules/audio/gainControl.ts
// Single responsibility: dynamic gain management.
// Reads calibration profile and prevents clipping.
// Auto-boost intentionally DISABLED to prevent noise amplification.
// ============================================================

import type { CalibrationProfile } from '../../types/audio';

const CLIP_CEILING = 0.95; // Prevent hard clipping above this RMS
const MIN_GAIN = 1.0;
const MAX_GAIN = 4.0;

export interface GainController {
  gainNode: GainNode;
  setCalibration(profile: CalibrationProfile): void;
  updateFromRMS(currentRMS: number): void;
  dispose(): void;
}

/**
 * Create a GainController backed by a Web Audio GainNode.
 * Optionally initialized with a CalibrationProfile.
 * NOTE: Auto-boost is intentionally disabled — it amplifies background noise
 * when there is no speech, causing Whisper to hallucinate in other languages.
 */
export function createGainController(
  ctx: AudioContext,
  calibration?: CalibrationProfile
): GainController {
  const gainNode = ctx.createGain();
  let targetGain = Math.min(calibration?.gainFactor ?? 1.0, MAX_GAIN);
  gainNode.gain.value = targetGain;

  return {
    gainNode,

    setCalibration(profile: CalibrationProfile) {
      targetGain = Math.min(Math.max(profile.gainFactor, MIN_GAIN), MAX_GAIN);
      gainNode.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.05);
    },

    updateFromRMS(currentRMS: number) {
      // Clipping protection only — pull gain back if signal is too hot
      if (currentRMS > CLIP_CEILING && targetGain > MIN_GAIN) {
        targetGain = Math.max(targetGain * 0.85, MIN_GAIN);
        gainNode.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.05);
      }
    },

    dispose() {
      gainNode.disconnect();
    },
  };
}
