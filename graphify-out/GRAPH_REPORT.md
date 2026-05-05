# Graph Report - Gopalan Hackathon  (2026-05-05)

## Corpus Check
- 32 files · ~18,581 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 136 nodes · 159 edges · 19 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]

## God Nodes (most connected - your core abstractions)
1. `request()` - 10 edges
2. `useAppContext()` - 9 edges
3. `process_pdf_pipeline()` - 7 edges
4. `assertSuccess()` - 7 edges
5. `generate_quiz_llm()` - 6 edges
6. `uploadLecture()` - 6 edges
7. `extract_json()` - 5 edges
8. `generate_explanation_llm()` - 5 edges
9. `wrap()` - 5 edges
10. `delay()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `upload_file()` --calls--> `process_pdf_pipeline()`  [INFERRED]
  Backend\main.py → Backend\app\services\logic.py
- `test_json_extraction()` --calls--> `extract_json()`  [INFERRED]
  Backend\test_pipeline.py → Backend\app\services\logic.py
- `test_full_pipeline_mock()` --calls--> `process_pdf_pipeline()`  [INFERRED]
  Backend\test_pipeline.py → Backend\app\services\logic.py
- `DebugPanel()` --calls--> `useAppContext()`  [INFERRED]
  Frontend\src\components\debug\DebugPanel.jsx → Frontend\src\context\AppContext.jsx
- `Topbar()` --calls--> `useAppContext()`  [INFERRED]
  Frontend\src\components\layout\Topbar.jsx → Frontend\src\context\AppContext.jsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (22): call_ollama(), chunk_text(), extract_json(), extract_pdf_text(), generate_explanation_llm(), generate_notes_llm(), generate_quiz_llm(), get_deterministic_intelligence() (+14 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (9): useAppContext(), Dashboard(), DebugPanel(), Leaderboard(), Notes(), Quiz(), Results(), Topbar() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.36
Nodes (14): assertSuccess(), delay(), generateUUID(), getDemoConfig(), getFlashcards(), getNotes(), getQuiz(), getSessionSummary() (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (9): get_cached_notes(), get_cached_quiz(), get_session_summary(), toggle_demo_mode(), get_notes(), get_quiz(), get_summary(), update_config() (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.28
Nodes (12): BaseModel, ExplanationSchema, LearnerStateSchema, MetaSchema, NotesData, QuizQuestionData, RecommendationData, ResponseWrapper (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (6): Base, Note, QuizQuestion, ResponseEvent, Session, TopicMastery

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (1): Robust JSON extraction using regex.

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (1): Robust Notes Generation with chunk-level fault tolerance.

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (1): Robust Quiz Generation with extraction and fallback.

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (1): Robust Explanation Generation.

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (1): Data-driven Intelligence Layer.

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (1): Enhanced Quiz Generation (Trap questions enabled).

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (1): Data-driven Intelligence Layer (Hardcoded overrides removed).

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (1): Requirement 4: Strengthened Post-Quiz Fallback.

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (1): Splits text into logical chunks of fixed size.

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (1): Simulates LLM extracting 2-3 topics from a chunk.

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (1): Merges topics from multiple chunks, limits to 6 max, and deduplicates.

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (1): Checks if the extracted topics follow the required schema.

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (1): Generates natural questions ONLY from the final merged topics.

## Knowledge Gaps
- **20 isolated node(s):** `Robust JSON extraction with aggressive cleaning.`, `Robust Notes Generation with chunk-level fault tolerance.`, `Robust Quiz Generation with extraction and fallback.`, `Robust Explanation Generation with Fail-Safe (Fix 1).`, `Data-driven Intelligence Layer.` (+15 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 21`** (1 nodes): `Robust JSON extraction using regex.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `Robust Notes Generation with chunk-level fault tolerance.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `Robust Quiz Generation with extraction and fallback.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `Robust Explanation Generation.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `Data-driven Intelligence Layer.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `Enhanced Quiz Generation (Trap questions enabled).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `Data-driven Intelligence Layer (Hardcoded overrides removed).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `Requirement 4: Strengthened Post-Quiz Fallback.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `Splits text into logical chunks of fixed size.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `Simulates LLM extracting 2-3 topics from a chunk.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `Merges topics from multiple chunks, limits to 6 max, and deduplicates.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `Checks if the extracted topics follow the required schema.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `Generates natural questions ONLY from the final merged topics.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `process_pdf_pipeline()` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `useAppContext()` (e.g. with `DebugPanel()` and `Topbar()`) actually correct?**
  _`useAppContext()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `process_pdf_pipeline()` (e.g. with `upload_file()` and `test_full_pipeline_mock()`) actually correct?**
  _`process_pdf_pipeline()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Robust JSON extraction with aggressive cleaning.`, `Robust Notes Generation with chunk-level fault tolerance.`, `Robust Quiz Generation with extraction and fallback.` to the rest of the system?**
  _20 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._