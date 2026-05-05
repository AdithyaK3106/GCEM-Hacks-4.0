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


def classify_level(clarity: float, rms: float) -> Literal["clear", "noisy", "silent"]:
    if rms < 0.005:
        return "silent"
    if clarity >= CLARITY_LEVELS["clear"]:
        return "clear"
    return "noisy"


def compute_metrics(pcm_bytes: bytes, sample_width: int = 2) -> dict:
    """
    Entry point: accepts raw PCM bytes (16-bit signed LE by default),
    returns a metrics dict ready for JSON serialisation.

    Args:
        pcm_bytes: Raw PCM audio bytes from client
        sample_width: Bytes per sample (2 = int16, 4 = float32)

    Returns:
        {
            "signal_energy": float,
            "noise_energy": float,
            "clarity": float,
            "level": "clear" | "noisy" | "silent"
        }
    """
    if not pcm_bytes:
        return {"signal_energy": 0.0, "noise_energy": 0.0, "clarity": 0.0, "level": "silent"}

    if sample_width == 4:
        # Float32 from AudioWorklet
        pcm = np.frombuffer(pcm_bytes, dtype=np.float32).copy()
    else:
        # Int16 from other sources — normalise to [-1, 1]
        pcm = np.frombuffer(pcm_bytes, dtype=np.int16).astype(np.float32) / 32768.0

    rms = compute_rms(pcm)
    noise_floor = compute_noise_floor(pcm)

    signal_energy = max(float(rms - noise_floor), 1e-9)
    noise_energy = max(float(noise_floor), 1e-9)
    clarity = compute_clarity(signal_energy, noise_energy)
    level = classify_level(clarity, rms)

    return {
        "signal_energy": round(signal_energy, 6),
        "noise_energy": round(noise_energy, 6),
        "clarity": round(clarity, 4),
        "level": level,
    }
