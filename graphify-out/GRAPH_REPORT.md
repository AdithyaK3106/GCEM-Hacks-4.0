# Graph Report - Gopalan Hackathon  (2026-05-05)

## Corpus Check
- 28 files · ~15,468 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 112 nodes · 136 edges · 14 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]

## God Nodes (most connected - your core abstractions)
1. `useAppContext()` - 9 edges
2. `extract_json()` - 6 edges
3. `generate_notes_llm()` - 6 edges
4. `generate_quiz_llm()` - 6 edges
5. `process_pdf_pipeline()` - 6 edges
6. `request()` - 6 edges
7. `uploadLecture()` - 6 edges
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
Cohesion: 0.1
Nodes (9): useAppContext(), Dashboard(), DebugPanel(), Leaderboard(), Notes(), Quiz(), Results(), Topbar() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (15): call_ollama(), chunk_text(), extract_json(), extract_pdf_text(), generate_explanation_llm(), generate_notes_llm(), generate_quiz_llm(), process_pdf_pipeline() (+7 more)

### Community 2 - "Community 2"
Cohesion: 0.28
Nodes (12): BaseModel, ExplanationSchema, LearnerStateSchema, MetaSchema, NotesData, QuizQuestionData, RecommendationData, ResponseWrapper (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.51
Nodes (10): assertSuccess(), delay(), generateUUID(), getNotes(), getQuiz(), logTiming(), request(), submitAnswer() (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.2
Nodes (8): get_cached_notes(), get_cached_quiz(), get_deterministic_intelligence(), Data-driven Intelligence Layer., get_notes(), get_quiz(), submit_answer(), upload_file()

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (6): Base, Note, QuizQuestion, ResponseEvent, Session, TopicMastery

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (1): Enhanced Quiz Generation (Trap questions enabled).

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (1): Data-driven Intelligence Layer (Hardcoded overrides removed).

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (1): Requirement 4: Strengthened Post-Quiz Fallback.

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (1): Splits text into logical chunks of fixed size.

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (1): Simulates LLM extracting 2-3 topics from a chunk.

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (1): Merges topics from multiple chunks, limits to 6 max, and deduplicates.

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (1): Checks if the extracted topics follow the required schema.

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (1): Generates natural questions ONLY from the final merged topics.

## Knowledge Gaps
- **13 isolated node(s):** `Robust JSON extraction using regex.`, `Robust Notes Generation with chunk-level fault tolerance.`, `Robust Quiz Generation with extraction and fallback.`, `Robust Explanation Generation.`, `Data-driven Intelligence Layer.` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 18`** (1 nodes): `Enhanced Quiz Generation (Trap questions enabled).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `Data-driven Intelligence Layer (Hardcoded overrides removed).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `Requirement 4: Strengthened Post-Quiz Fallback.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `Splits text into logical chunks of fixed size.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `Simulates LLM extracting 2-3 topics from a chunk.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `Merges topics from multiple chunks, limits to 6 max, and deduplicates.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `Checks if the extracted topics follow the required schema.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `Generates natural questions ONLY from the final merged topics.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `process_pdf_pipeline()` connect `Community 1` to `Community 4`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `useAppContext()` (e.g. with `DebugPanel()` and `Topbar()`) actually correct?**
  _`useAppContext()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Robust JSON extraction using regex.`, `Robust Notes Generation with chunk-level fault tolerance.`, `Robust Quiz Generation with extraction and fallback.` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._