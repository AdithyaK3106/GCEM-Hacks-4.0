# 🎯 INTEGRATION PROMPT: Real-Time Audio Intelligence Layer

**Task:** Integrate a modular, real-time audio transcription and noise suppression system into the Anti-Gravity (GCEM Hacks 4.0) project without breaking the existing PDF-to-Quiz pipeline.

---

### 🧱 1. ARCHITECTURAL MANDATE: MODULARITY FIRST
You MUST implement this as a set of independent, single-responsibility modules. Do not merge audio logic into existing components.

#### **Frontend Modules (`/src/modules/audio/`)**
1.  **`recorder.ts`**: High-level orchestrator using `AudioWorklet` for raw 16kHz capture.
2.  **`noiseSuppression.ts`**: Signal processing module. Implement **RNNoise (WASM)** as primary, with a **Bi-quad Filter (High-pass)** fallback.
3.  **`gainControl.ts`**: Real-time RMS-based normalization to amplify quiet speech.
4.  **`streamClient.ts`**: WebSocket manager for binary PCM streaming (200ms chunks).

#### **Backend Modules (`/app/services/audio/`)**
1.  **`audio_stream.py`**: WebSocket handler for `/stream-audio`.
2.  **`transcription_stream.py`**: Incremental Whisper (`faster-whisper`) engine.

---

### 🔗 2. INTEGRATION POINTS (MINIMAL HOOKS)
Integrate the feature into the existing pipeline using these exact points:

*   **`Upload.jsx`**: Add a "Record Mode" toggle. If active, replace the File Dropzone with the `AudioRecorder` component.
*   **Pipeline Entry**: Once recording stops, the accumulated transcript MUST be converted into a `File` object (synthetic `.txt`) and passed to the existing `uploadLecture()` function to trigger the standard Notes/Quiz generation.
*   **`main.py`**: Add exactly one new WebSocket route: `@app.websocket("/stream-audio")`.

---

### ⚙️ 3. CORE REQUIREMENTS
*   **Streaming Only**: No batch uploads. Audio must be processed in 200ms-300ms chunks for live feedback.
*   **Zero Simulation**: Use real browser `navigator.mediaDevices` and real `faster-whisper` backend. No mock text or timers.
*   **Audio Quality**:
    *   Sample Rate: 16,000Hz (standard for Whisper).
    *   Format: Float32 PCM.
*   **Safety Fallbacks**:
    *   If WASM (RNNoise) fails to load, silently switch to `WebAudio` gain/filter chain.
    *   If WebSocket disconnects, buffer locally for 5s then attempt reconnect.

---

### 📦 4. REQUIRED OUTPUT FORMAT
Return your implementation in this order:

1.  **Module Map**: List of all new files created.
2.  **Patch List**: Exact lines modified in `main.py` and `Upload.jsx`.
3.  **Full Source**: Code for the new modular audio engine.
4.  **Verification Steps**: 
    *   How to test noise suppression (e.g., fan noise test).
    *   How to verify transcript-to-notes handoff.
5.  **Setup Command**: Single command to install any new dependencies (e.g., `faster-whisper`, `rnnoise-wasm`).

---

### ⚠️ FINAL WARNING
If any core logic in `logic.py` or existing PDF processing is altered, the integration is considered a failure. **Keep the audio layer isolated.**
