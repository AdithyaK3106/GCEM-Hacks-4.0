// ============================================================
// /modules/audio/noiseFilter.ts
// Single responsibility: apply noise reduction to an AudioNode
// chain. Uses 'basic' Web Audio filters only (rnnoise removed).
// ============================================================

import type { NoiseFilterStrategy } from '../../types/audio';

export interface FilterChain {
  inputNode: AudioNode;
  outputNode: AudioNode;
  disconnect(): void;
}

/**
 * Build a basic noise-reduction chain using Web Audio API:
 *   High-pass → Compressor → Low-pass
 *
 * High-pass at 80Hz removes low-frequency rumble (HVAC, fans).
 * Compressor reduces dynamic range and softens noise bursts.
 * Low-pass at 8000Hz removes high-frequency hiss.
 */
function buildBasicFilterChain(ctx: AudioContext): FilterChain {
  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 80;
  highpass.Q.value = 0.7;

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -40;
  compressor.knee.value = 10;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.15;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 8000;
  lowpass.Q.value = 0.7;

  // Chain: highpass → compressor → lowpass
  highpass.connect(compressor);
  compressor.connect(lowpass);

  return {
    inputNode: highpass,
    outputNode: lowpass,
    disconnect() {
      highpass.disconnect();
      compressor.disconnect();
      lowpass.disconnect();
    },
  };
}

/**
 * Apply a noise filter chain between a source and destination AudioNode.
 * Always uses the 'basic' Web Audio chain (rnnoise-wasm removed).
 */
export async function applyNoiseFilter(
  ctx: AudioContext,
  source: AudioNode,
  dest: AudioNode,
  strategy: NoiseFilterStrategy = 'basic'
): Promise<FilterChain> {
  // Always use basic — rnnoise-wasm dependency removed for stability
  const chain = buildBasicFilterChain(ctx);
  source.connect(chain.inputNode);
  chain.outputNode.connect(dest);
  return chain;
}
