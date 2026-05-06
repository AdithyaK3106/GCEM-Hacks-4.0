# Graph Report - Gopalan Hackathon  (2026-05-06)

## Corpus Check
- 69 files · ~29,394 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 267 nodes · 291 edges · 30 communities detected
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]

## God Nodes (most connected - your core abstractions)
1. `TranscriptionStream` - 15 edges
2. `handle_audio_stream()` - 13 edges
3. `useAppContext()` - 12 edges
4. `request()` - 11 edges
5. `ClarityTracker` - 8 edges
6. `process_pdf_pipeline()` - 8 edges
7. `assertSuccess()` - 8 edges
8. `delay()` - 7 edges
9. `compute_metrics()` - 6 edges
10. `process_chunk()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `stream_audio()` --calls--> `handle_audio_stream()`  [INFERRED]
  Backend\main.py → Backend\app\services\audio_stream.py
- `upload_file()` --calls--> `process_pdf_pipeline()`  [INFERRED]
  Backend\main.py → Backend\app\services\logic.py
- `submit_answer()` --calls--> `get_deterministic_intelligence()`  [INFERRED]
  Backend\main.py → Backend\app\services\logic.py
- `test_json_extraction()` --calls--> `extract_json()`  [INFERRED]
  Backend\test_pipeline.py → Backend\app\services\logic.py
- `test_full_pipeline_mock()` --calls--> `process_pdf_pipeline()`  [INFERRED]
  Backend\test_pipeline.py → Backend\app\services\logic.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (35): debug_pdf(), call_ollama(), chunk_text(), extract_json(), extract_text(), generate_explanation_llm(), generate_notes_llm(), generate_quiz_llm() (+27 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (33): ClarityTracker, compute_clarity(), compute_metrics(), compute_noise_floor(), compute_rms(), Root Mean Square energy of a PCM buffer., Estimate noise floor as the RMS of the quietest 20% of windows.     Falls back t, clarity = signal_energy / noise_energy     Clamped to [0, 2] for a stable displa (+25 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (13): useAppContext(), Dashboard(), DebugPanel(), ExamModeButton(), ExamModePage(), Leaderboard(), Notes(), Quiz() (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.32
Nodes (16): assertSuccess(), delay(), generateUUID(), getDemoConfig(), getExamData(), getFlashcards(), getNotes(), getQuiz() (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.26
Nodes (13): BaseModel, BulkSubmitRequest, ExplanationSchema, LearnerStateSchema, MetaSchema, NotesData, QuizQuestionData, RecommendationData (+5 more)

### Community 5 - "Community 5"
Cohesion: 0.24
Nodes (8): _normalise(), process_chunk(), Convert raw PCM bytes to float32 numpy array in [-1, 1]., Gently normalise PCM — only applies gain if RMS is very low.     Hard-caps gain, Process a single PCM chunk.      Returns:         Normalised float32 numpy array, Convert float32 numpy array back to int16 bytes (for Whisper)., _to_float32(), to_int16_bytes()

### Community 6 - "Community 6"
Cohesion: 0.33
Nodes (6): Base, Note, QuizQuestion, ResponseEvent, Session, TopicMastery

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (2): applyNoiseFilter(), buildBasicFilterChain()

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (1): Robust Explanation Generation with Fail-Safe (Fix 1).

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (1): Data-driven Intelligence Layer.

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (1): Generate lightweight flashcards from notes (Fix 4).

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (1): Robust JSON extraction with aggressive cleaning.

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (1): Robust Notes Generation optimized for 14B/7B speed.

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (1): Robust Quiz Generation with extraction and fallback.

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (1): Robust Explanation Generation with Fail-Safe (Fix 1).

### Community 56 - "Community 56"
Cohesion: 1.0
Nodes (1): Robust extraction from PDF or Text files.

### Community 57 - "Community 57"
Cohesion: 1.0
Nodes (1): Data-driven Intelligence Layer.

### Community 58 - "Community 58"
Cohesion: 1.0
Nodes (1): Generate lightweight flashcards from notes (Fix 4).

### Community 59 - "Community 59"
Cohesion: 1.0
Nodes (1): Entry point: accepts raw PCM bytes (16-bit signed LE by default),     returns a

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (1): Convert float32 numpy array back to int16 bytes (for Whisper).

### Community 61 - "Community 61"
Cohesion: 1.0
Nodes (1): Robust JSON extraction with aggressive cleaning.

### Community 62 - "Community 62"
Cohesion: 1.0
Nodes (1): Robust Notes Generation optimized for 8GB VRAM speed.

### Community 63 - "Community 63"
Cohesion: 1.0
Nodes (1): Robust Quiz Generation with extraction and fallback.

### Community 64 - "Community 64"
Cohesion: 1.0
Nodes (1): Robust Explanation Generation with Fail-Safe (Fix 1).

### Community 65 - "Community 65"
Cohesion: 1.0
Nodes (1): Data-driven Intelligence Layer.

### Community 66 - "Community 66"
Cohesion: 1.0
Nodes (1): Generate lightweight flashcards from notes (Fix 4).

### Community 67 - "Community 67"
Cohesion: 1.0
Nodes (1): Accumulates audio chunks and emits transcripts as they come.     Maintains a rol

### Community 68 - "Community 68"
Cohesion: 1.0
Nodes (1): Add a processed chunk to the buffer.         Returns True when the buffer is ful

### Community 69 - "Community 69"
Cohesion: 1.0
Nodes (1): Drain the buffer and return concatenated samples.

### Community 70 - "Community 70"
Cohesion: 1.0
Nodes (1): Flush the buffer and transcribe.

## Knowledge Gaps
- **49 isolated node(s):** `Root Mean Square energy of a PCM buffer.`, `Estimate noise floor as the RMS of the quietest 20% of windows.     Falls back t`, `clarity = signal_energy / noise_energy     Clamped to [0, 2] for a stable displa`, `FIX: Track max RMS and smoothed clarity across chunks.`, `Entry point: accepts raw PCM bytes (16-bit signed LE by default),     returns a` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 9`** (3 nodes): `noiseFilter.ts`, `applyNoiseFilter()`, `buildBasicFilterChain()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `Robust Explanation Generation with Fail-Safe (Fix 1).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `Data-driven Intelligence Layer.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `Generate lightweight flashcards from notes (Fix 4).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `Robust JSON extraction with aggressive cleaning.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `Robust Notes Generation optimized for 14B/7B speed.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `Robust Quiz Generation with extraction and fallback.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `Robust Explanation Generation with Fail-Safe (Fix 1).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `Robust extraction from PDF or Text files.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `Data-driven Intelligence Layer.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `Generate lightweight flashcards from notes (Fix 4).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `Entry point: accepts raw PCM bytes (16-bit signed LE by default),     returns a`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `Convert float32 numpy array back to int16 bytes (for Whisper).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `Robust JSON extraction with aggressive cleaning.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (1 nodes): `Robust Notes Generation optimized for 8GB VRAM speed.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `Robust Quiz Generation with extraction and fallback.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (1 nodes): `Robust Explanation Generation with Fail-Safe (Fix 1).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (1 nodes): `Data-driven Intelligence Layer.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (1 nodes): `Generate lightweight flashcards from notes (Fix 4).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 67`** (1 nodes): `Accumulates audio chunks and emits transcripts as they come.     Maintains a rol`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (1 nodes): `Add a processed chunk to the buffer.         Returns True when the buffer is ful`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (1 nodes): `Drain the buffer and return concatenated samples.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 70`** (1 nodes): `Flush the buffer and transcribe.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `handle_audio_stream()` connect `Community 1` to `Community 0`, `Community 5`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `process_chunk()` connect `Community 5` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `generate_notes_llm()` connect `Community 0` to `Community 5`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `TranscriptionStream` (e.g. with `Background task to remove zombie connections.` and `Parse the wire format sent by streamClient.ts:       [4 bytes: header length (ui`) actually correct?**
  _`TranscriptionStream` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `handle_audio_stream()` (e.g. with `stream_audio()` and `TranscriptionStream`) actually correct?**
  _`handle_audio_stream()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `useAppContext()` (e.g. with `DebugPanel()` and `ExamModeButton()`) actually correct?**
  _`useAppContext()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Root Mean Square energy of a PCM buffer.`, `Estimate noise floor as the RMS of the quietest 20% of windows.     Falls back t`, `clarity = signal_energy / noise_energy     Clamped to [0, 2] for a stable displa` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._