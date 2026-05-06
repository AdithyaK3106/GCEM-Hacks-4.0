# ============================================================
# /services/audio_metrics.py
# Single responsibility: compute real-time audio quality metrics.
# Stateless pure functions — no I/O, no side effects.
# ============================================================

import numpy as np
from typing import Literal

CLARITY_LEVELS = {
    "clear": 0.6,
    "noisy": 0.2,
    "silent": 0.0,
}


def compute_rms(pcm: np.ndarray) -> float:
    """Root Mean Square energy of a PCM buffer."""
    if len(pcm) == 0:
        return 0.0
    return float(np.sqrt(np.mean(pcm.astype(np.float64) ** 2)))


def compute_noise_floor(pcm: np.ndarray, window_size: int = 320) -> float:
    """
    Estimate noise floor as the RMS of the quietest 20% of windows.
    Falls back to 5% of signal RMS if signal is too short.
    """
    if len(pcm) < window_size:
        return compute_rms(pcm) * 0.05

    n_windows = len(pcm) // window_size
    windows = pcm[: n_windows * window_size].reshape(n_windows, window_size)
    rms_values = np.sqrt(np.mean(windows.astype(np.float64) ** 2, axis=1))
    rms_values.sort()
    cutoff = max(1, int(len(rms_values) * 0.2))
    return float(np.mean(rms_values[:cutoff]))


def compute_clarity(signal_energy: float, noise_energy: float) -> float:
    """
    clarity = signal_energy / noise_energy
    Clamped to [0, 2] for a stable display range.
    """
    if noise_energy < 1e-9:
        return 2.0
    return float(min(signal_energy / noise_energy, 2.0))


class ClarityTracker:
    """FIX: Track max RMS and smoothed clarity across chunks."""
    def __init__(self):
        self._max_rms = 0.01
        self._clarity = 0.0

    def process(self, rms: float) -> float:
        # FIX: remove background noise influence
        if rms < 0.005:
            self._clarity = 0.8 * self._clarity  # decay
            return 0.0

        # FIX: adaptive scaling based on recent max energy
        self._max_rms = max(self._max_rms * 0.95, rms)
        
        # Base clarity on normalized intensity
        raw_clarity = min(rms / (self._max_rms + 1e-6), 1.0)
        
        # FIX: smooth UI transitions
        self._clarity = 0.8 * self._clarity + 0.2 * raw_clarity
        return float(self._clarity)


def compute_metrics(pcm_bytes: bytes, sample_width: int = 2, tracker: ClarityTracker = None) -> dict:
    """
    Entry point: accepts raw PCM bytes (16-bit signed LE by default),
    returns a metrics dict ready for JSON serialisation.
    """
    if not pcm_bytes:
        return {"signal_energy": 0.0, "noise_energy": 0.0, "rms": 0.0, "clarity": 0.0, "level": "silent"}

    if sample_width == 4:
        # Float32 from AudioWorklet
        pcm = np.frombuffer(pcm_bytes, dtype=np.float32).copy()
    else:
        # Int16 from other sources — normalise to [-1, 1]
        pcm = np.frombuffer(pcm_bytes, dtype=np.int16).astype(np.float32) / 32768.0

    rms = compute_rms(pcm)
    
    if tracker:
        clarity = tracker.process(rms)
    else:
        # Fallback to simple normalization if no tracker
        clarity = min(rms / 0.02, 1.0)

    noise_floor = compute_noise_floor(pcm)
    signal_energy = max(float(rms - noise_floor), 1e-9)
    noise_energy = max(float(noise_floor), 1e-9)
    
    # Map clarity to levels for UI labels
    if rms < 0.005:
        level = "silent"
    elif clarity > 0.6:
        level = "clear"
    else:
        level = "noisy"

    return {
        "signal_energy": round(signal_energy, 6),
        "noise_energy": round(noise_energy, 6),
        "rms": round(rms, 6),
        "clarity": round(clarity, 4),
        "level": level,
    }
