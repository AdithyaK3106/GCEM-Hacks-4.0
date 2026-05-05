# ============================================================
# /services/transcription_stream.py
# Single responsibility: stream audio chunks to Whisper
# and yield partial transcript results.
# ============================================================

import logging
import asyncio
import io
import numpy as np
from typing import AsyncIterator, Optional

logger = logging.getLogger(__name__)

# Lazy import — only loaded when first transcription is requested
_whisper_model = None
WHISPER_MODEL_SIZE = "base.en"  # English-only model: same speed as base, far fewer hallucinations


def _get_model():
    """Load faster-whisper model once and reuse (thread-safe via GIL)."""
    global _whisper_model
    if _whisper_model is None:
        try:
            import torch
            from faster_whisper import WhisperModel

            device = "cuda" if torch.cuda.is_available() else "cpu"
            compute = "float16" if device == "cuda" else "int8"
            logger.info(f"[transcription] Loading faster-whisper '{WHISPER_MODEL_SIZE}' on {device} ({compute})")
            _whisper_model = WhisperModel(
                WHISPER_MODEL_SIZE,
                device=device,
                compute_type=compute,
            )
            logger.info("[transcription] Model loaded successfully.")
        except ImportError:
            logger.error(
                "[transcription] faster-whisper not installed. "
                "Run: pip install faster-whisper"
            )
            raise
    return _whisper_model


async def transcribe_chunk(
    samples: np.ndarray,
    language: Optional[str] = None,
) -> dict:
    """
    Transcribe a single float32 numpy array chunk.
    Runs synchronous Whisper in a thread pool to avoid blocking the event loop.

    Returns:
        {"text": str, "is_final": bool}
    """
    loop = asyncio.get_event_loop()

    def _run():
        model = _get_model()
        segments, _ = model.transcribe(
            samples,
            language="en",
            beam_size=1,
            temperature=0.0,
            no_speech_threshold=0.8,     # Very aggressive — only pass audio Whisper is VERY sure has speech
            condition_on_previous_text=False,
        )
        # Only keep segments where Whisper is highly confident speech occurred
        kept = []
        for seg in segments:
            logger.info(f"[transcription] seg no_speech_prob={seg.no_speech_prob:.3f} text='{seg.text.strip()}'")
            if seg.no_speech_prob < 0.4 and seg.text.strip():
                kept.append(seg.text.strip())
        return " ".join(kept).strip()

    try:
        text = await loop.run_in_executor(None, _run)
        return {"text": text, "is_final": True}
    except Exception as e:
        logger.warning(f"[transcription] Whisper error: {e}")
        return {"text": "", "is_final": False}


class TranscriptionStream:
    """
    Accumulates audio chunks and emits transcripts as they come.
    Maintains a rolling buffer so short chunks get context.
    """

    BUFFER_SECONDS = 2   # 2s buffer: low latency but enough context for full words
    SAMPLE_RATE = 16000

    def __init__(self):
        self._buffer: list[np.ndarray] = []
        self._buffer_samples = 0
        self._target_samples = self.SAMPLE_RATE * self.BUFFER_SECONDS

    def add_chunk(self, samples: np.ndarray) -> bool:
        """
        Add a processed chunk to the buffer.
        Returns True when the buffer is full and ready for transcription.
        """
        self._buffer.append(samples)
        self._buffer_samples += len(samples)
        return self._buffer_samples >= self._target_samples

    def flush(self) -> np.ndarray:
        """Drain the buffer and return concatenated samples."""
        if not self._buffer:
            return np.array([], dtype=np.float32)
        combined = np.concatenate(self._buffer)
        self._buffer = []
        self._buffer_samples = 0
        return combined

    async def transcribe_buffered(self) -> dict:
        """Flush the buffer and transcribe."""
        samples = self.flush()
        if len(samples) == 0:
            return {"text": "", "is_final": False}
        return await transcribe_chunk(samples)
