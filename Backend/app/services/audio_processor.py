# ============================================================
# /services/audio_processor.py
# Single responsibility: clean + normalise raw PCM audio
# before forwarding to the transcription service.
# Pipeline: decode → normalise → trim silence → yield
# ============================================================

import numpy as np
import logging

logger = logging.getLogger(__name__)

TARGET_RMS = 0.08          # Target RMS level (only applied if audio is already close)
SILENCE_THRESHOLD = 0.0005 # FIX: extremely low hard gate for safety
MIN_CHUNK_SAMPLES = 160    # Discard chunks shorter than this
MAX_GAIN = 10.0            # FIX: increased gain to boost soft speakers


def _to_float32(pcm_bytes: bytes, sample_width: int = 4) -> np.ndarray:
    """Convert raw PCM bytes to float32 numpy array in [-1, 1]."""
    if sample_width == 4:
        arr = np.frombuffer(pcm_bytes, dtype=np.float32).copy()
    elif sample_width == 2:
        arr = np.frombuffer(pcm_bytes, dtype=np.int16).astype(np.float32) / 32768.0
    else:
        raise ValueError(f"Unsupported sample_width: {sample_width}")
    return arr


def _normalise(samples: np.ndarray, target_rms: float = TARGET_RMS) -> np.ndarray:
    """
    Gently normalise PCM — only applies gain if RMS is very low.
    Hard-caps gain at MAX_GAIN to prevent background noise amplification.
    """
    rms = float(np.sqrt(np.mean(samples ** 2)))
    if rms < 1e-9:
        return samples  # Dead silent — no gain
    # Only apply gain if audio is genuinely quiet (real speech)
    # Hard cap at MAX_GAIN to prevent noise amplification
    gain = min(target_rms / rms, MAX_GAIN)
    normalised = samples * gain
    return np.clip(normalised, -1.0, 1.0)


def _is_silent(samples: np.ndarray) -> bool:
    rms = float(np.sqrt(np.mean(samples ** 2)))
    return rms < SILENCE_THRESHOLD


def process_chunk(
    pcm_bytes: bytes,
    sample_rate: int = 16000,
    sample_width: int = 4,
) -> np.ndarray | None:
    """
    Process a single PCM chunk.

    Returns:
        Normalised float32 numpy array ready for transcription,
        or None if the chunk is silent or too short.
    """
    if len(pcm_bytes) < MIN_CHUNK_SAMPLES * sample_width:
        logger.info(f"[audio_processor] Chunk too short: {len(pcm_bytes)} bytes")
        return None

    try:
        samples = _to_float32(pcm_bytes, sample_width)
        rms = float(np.sqrt(np.mean(samples ** 2)))
        # logger.info(f"[audio_processor] Chunk RMS: {rms:.6f}")
    except Exception as e:
        logger.warning(f"[audio_processor] Decode error: {e}")
        return None

    # FIX: soft silence handling instead of hard drop
    if rms < SILENCE_THRESHOLD:
        logger.info(f"[audio_processor] Extremely silent chunk skipped (RMS: {rms:.6f})")
        return None

    # FIX: boost low-volume audio (critical for demo)
    if rms < 0.01:
        samples = samples * (0.01 / (rms + 1e-6))
        # Recalculate RMS for normalization logic
        rms = float(np.sqrt(np.mean(samples ** 2)))

    return _normalise(samples)


def to_int16_bytes(samples: np.ndarray) -> bytes:
    """Convert float32 numpy array back to int16 bytes (for Whisper)."""
    int16 = (samples * 32767).astype(np.int16)
    return int16.tobytes()
