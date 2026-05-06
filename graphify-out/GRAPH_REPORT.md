# Graph Report - Gopalan Hackathon  (2026-05-06)

## Corpus Check
- 50 files · ~22,624 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 200 nodes · 249 edges · 9 communities detected
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `useAppContext()` - 12 edges
2. `handle_audio_stream()` - 10 edges
3. `TranscriptionStream` - 10 edges
4. `request()` - 10 edges
5. `compute_metrics()` - 7 edges
6. `process_chunk()` - 7 edges
7. `process_pdf_pipeline()` - 7 edges
8. `assertSuccess()` - 7 edges
9. `generate_quiz_llm()` - 6 edges
10. `delay()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `stream_audio()` --calls--> `handle_audio_stream()`  [INFERRED]
  Backend\main.py → Backend\app\services\audio_stream.py
- `upload_file()` --calls--> `process_pdf_pipeline()`  [INFERRED]
  Backend\main.py → Backend\app\services\logic.py
- `test_json_extraction()` --calls--> `extract_json()`  [INFERRED]
  Backend\test_pipeline.py → Backend\app\services\logic.py
- `test_full_pipeline_mock()` --calls--> `process_pdf_pipeline()`  [INFERRED]
  Backend\test_pipeline.py → Backend\app\services\logic.py
- `handle_audio_stream()` --calls--> `compute_metrics()`  [INFERRED]
  Backend\app\services\audio_stream.py → Backend\app\services\audio_metrics.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (32): call_ollama(), chunk_text(), extract_json(), extract_pdf_text(), generate_explanation_llm(), generate_notes_llm(), generate_quiz_llm(), get_cached_notes() (+24 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (13): useAppContext(), Dashboard(), DebugPanel(), ExamModeButton(), ExamModePage(), Leaderboard(), Notes(), Quiz() (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (15): handle_audio_stream(), _parse_binary_message(), Parse the wire format sent by streamClient.ts:       [4 bytes: header length (ui, Send a JSON message; ignore closed connection errors., WebSocket handler for /stream-audio.     Register in main.py:         @app.webso, _send_json(), _get_model(), Add a processed chunk to the buffer.         Returns True when the buffer is ful (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.33
Nodes (15): assertSuccess(), delay(), generateUUID(), getDemoConfig(), getExamData(), getFlashcards(), getNotes(), getQuiz() (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.28
Nodes (12): BaseModel, ExplanationSchema, LearnerStateSchema, MetaSchema, NotesData, QuizQuestionData, RecommendationData, ResponseWrapper (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.31
Nodes (9): classify_level(), compute_clarity(), compute_metrics(), compute_noise_floor(), compute_rms(), Root Mean Square energy of a PCM buffer., Estimate noise floor as the RMS of the quietest 20% of windows.     Falls back t, clarity = signal_energy / noise_energy     Clamped to [0, 2] for a stable displa (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.27
Nodes (9): _is_silent(), _normalise(), process_chunk(), Convert raw PCM bytes to float32 numpy array in [-1, 1]., Gently normalise PCM — only applies gain if RMS is very low.     Hard-caps gain, Process a single PCM chunk.      Returns:         Normalised float32 numpy array, Convert float32 numpy array back to int16 bytes (for Whisper)., _to_float32() (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (6): Base, Note, QuizQuestion, ResponseEvent, Session, TopicMastery

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (2): applyNoiseFilter(), buildBasicFilterChain()

## Knowledge Gaps
- **21 isolated node(s):** `Root Mean Square energy of a PCM buffer.`, `Estimate noise floor as the RMS of the quietest 20% of windows.     Falls back t`, `clarity = signal_energy / noise_energy     Clamped to [0, 2] for a stable displa`, `Entry point: accepts raw PCM bytes (16-bit signed LE by default),     returns a`, `Convert raw PCM bytes to float32 numpy array in [-1, 1].` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 10`** (3 nodes): `noiseFilter.ts`, `applyNoiseFilter()`, `buildBasicFilterChain()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `handle_audio_stream()` connect `Community 2` to `Community 0`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `process_chunk()` connect `Community 6` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `generate_notes_llm()` connect `Community 0` to `Community 6`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `useAppContext()` (e.g. with `DebugPanel()` and `Sidebar()`) actually correct?**
  _`useAppContext()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `handle_audio_stream()` (e.g. with `stream_audio()` and `TranscriptionStream`) actually correct?**
  _`handle_audio_stream()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `TranscriptionStream` (e.g. with `Parse the wire format sent by streamClient.ts:       [4 bytes: header length (ui` and `Send a JSON message; ignore closed connection errors.`) actually correct?**
  _`TranscriptionStream` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Root Mean Square energy of a PCM buffer.`, `Estimate noise floor as the RMS of the quietest 20% of windows.     Falls back t`, `clarity = signal_energy / noise_energy     Clamped to [0, 2] for a stable displa` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._