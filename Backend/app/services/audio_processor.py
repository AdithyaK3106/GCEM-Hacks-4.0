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
SILENCE_THRESHOLD = 0.005  # Chunks below this RMS are silence — skip them
MIN_CHUNK_SAMPLES = 160    # Discard chunks shorter than this
MAX_GAIN = 3.0             # Cap normalization gain to avoid amplifying background noise


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
        logger.debug("[audio_processor] Chunk too short, skipping")
        return None

    try:
        samples = _to_float32(pcm_bytes, sample_width)
    except Exception as e:
        logger.warning(f"[audio_processor] Decode error: {e}")
        return None

    if _is_silent(samples):
        logger.debug("[audio_processor] Silent chunk, skipping")
        return None

    return _normalise(samples)


def to_int16_bytes(samples: np.ndarray) -> bytes:
    """Convert float32 numpy array back to int16 bytes (for Whisper)."""
    int16 = (samples * 32767).astype(np.int16)
    return int16.tobytes()
