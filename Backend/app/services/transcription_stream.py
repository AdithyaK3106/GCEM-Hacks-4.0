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
WHISPER_MODEL_SIZE = "tiny.en"  # FASTEST model for real-time responsiveness


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
    **whisper_kwargs
) -> dict:
    """
    Transcribe a single float32 numpy array chunk.
    Runs synchronous Whisper in a thread pool to avoid blocking the event loop.
    """
    loop = asyncio.get_event_loop()

    def _run():
        model = _get_model()
        params = {
            "language": "en",
            "beam_size": 1,
            "temperature": 0.0,
            "no_speech_threshold": 0.6, # More lenient
            "condition_on_previous_text": True,
            "log_prob_threshold": -1.5,
        }
        params.update(whisper_kwargs)
        
        segments, _ = model.transcribe(samples, **params)
        
        kept = []
        for seg in segments:
            # More tolerant probability limits
            prob_limit = 0.5 if params.get("condition_on_previous_text") else 0.4
            if seg.no_speech_prob < prob_limit and seg.text.strip():
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

    # FIX: Optimized latency settings
    BUFFER_SECONDS = 1.5
    PREVIEW_SECONDS = 0.4
    OVERLAP_SECONDS = 0.4
    SAMPLE_RATE = 16000

    def __init__(self):
        self._buffer: list[np.ndarray] = []
        self._buffer_samples = 0
        self._target_samples = int(self.SAMPLE_RATE * self.BUFFER_SECONDS)
        self._preview_samples = int(self.SAMPLE_RATE * self.PREVIEW_SECONDS)
        self._overlap_samples = int(self.SAMPLE_RATE * self.OVERLAP_SECONDS)
        self._last_text = ""
        self._stable_transcript = ""
        self._last_preview = ""
        self._preview_fired = False

    def add_chunk(self, samples: np.ndarray) -> str:
        """
        Add a processed chunk to the buffer.
        Returns: "preview" | "final" | "wait"
        """
        self._buffer.append(samples)
        self._buffer_samples += len(samples)
        
        if self._buffer_samples >= self._target_samples:
            self._preview_fired = False
            return "final"
        elif self._buffer_samples >= self._preview_samples and not self._preview_fired:
            self._preview_fired = True
            return "preview"
        return "wait"

    def get_current_buffer(self) -> np.ndarray:
        """Return concatenated buffer without flushing."""
        if not self._buffer:
            return np.array([], dtype=np.float32)
        return np.concatenate(self._buffer)

    async def transcribe_preview(self) -> str:
        """FAST PREVIEW PASS (~0.5s latency)"""
        samples = self.get_current_buffer()
        if len(samples) == 0: 
            return self._stable_transcript
        
        result = await transcribe_chunk(
            samples, 
            condition_on_previous_text=False, # FAST preview
            beam_size=1,
            temperature=0.0,
            no_speech_threshold=0.8
        )
        
        preview_text = result["text"].strip()
        self._last_preview = preview_text
        
        if preview_text:
            return (self._stable_transcript + " " + preview_text).strip()
        return self._stable_transcript

    def flush(self) -> np.ndarray:
        """Drain the buffer and return concatenated samples, keeping overlap."""
        if not self._buffer:
            return np.array([], dtype=np.float32)
        
        combined = np.concatenate(self._buffer)
        
        if len(combined) > self._overlap_samples:
            overlap = combined[-self._overlap_samples:]
            self._buffer = [overlap]
            self._buffer_samples = len(overlap)
            return combined
        else:
            self._buffer = []
            self._buffer_samples = 0
            return combined

    async def transcribe_buffered(self) -> dict:
        """Flush the buffer and transcribe with final quality and alignment."""
        samples = self.flush()
        
        # SKIP SMALL AUDIO CHUNKS
        if len(samples) < int(0.2 * self.SAMPLE_RATE):
            logger.info(f"[transcription] Chunk too small ({len(samples)}), skipping.")
            return {"text": self._stable_transcript, "isFinal": True}
        
        # FINAL PASS (One pass only for speed)
        final_result = await transcribe_chunk(
            samples,
            condition_on_previous_text=True,
            beam_size=1,
            temperature=0.0
        )
        final_text = final_result["text"].strip()
        logger.info(f"[transcription] Final Pass: '{final_text}'")

        # STRONG DEDUPLICATION
        def remove_repetition(prev, new):
            if not prev: return new
            # If the new text is already completely contained in the previous text (case-insensitive), skip it
            if len(new) > 4 and new.lower() in prev.lower(): 
                return ""
            
            prev_words = prev.split()
            new_words = new.split()
            
            # Look for overlapping words at the boundary
            for i in range(min(len(prev_words), len(new_words)), 0, -1):
                if prev_words[-i:] == new_words[:i]:
                    return " ".join(new_words[i:])
            return new

        # We deduplicate the final_text against self._last_text (the full text of the PREVIOUS chunk)
        dedup_text = remove_repetition(self._last_text, final_text)
        logger.info(f"[transcription] Deduped: '{dedup_text}' (from last_text: '{self._last_text}')")
        
        if dedup_text:
            # Update last_text to be the full final_text for next chunk's deduplication
            self._last_text = final_text
            # Append to stable transcript if not already present
            if dedup_text not in self._stable_transcript:
                self._stable_transcript = (self._stable_transcript + " " + dedup_text).strip()
            
        return {
            "text": self._stable_transcript, 
            "isFinal": True
        }

