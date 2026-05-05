# Graph Report - Gopalan Hackathon  (2026-05-05)

## Corpus Check
- 28 files · ~15,135 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 107 nodes · 132 edges · 11 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.8)
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

## God Nodes (most connected - your core abstractions)
1. `useAppContext()` - 9 edges
2. `generate_quiz_llm()` - 6 edges
3. `process_pdf_pipeline()` - 6 edges
4. `request()` - 6 edges
5. `uploadLecture()` - 6 edges
6. `generate_notes_llm()` - 5 edges
7. `wrap()` - 5 edges
8. `delay()` - 5 edges
9. `assertSuccess()` - 5 edges
10. `getNotes()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `test_full_pipeline_with_mock_pdf()` --calls--> `process_pdf_pipeline()`  [INFERRED]
  Backend\test_pipeline.py → Backend\app\services\logic.py
- `upload_file()` --calls--> `process_pdf_pipeline()`  [INFERRED]
  Backend\main.py → Backend\app\services\logic.py
- `DebugPanel()` --calls--> `useAppContext()`  [INFERRED]
  Frontend\src\components\debug\DebugPanel.jsx → Frontend\src\context\AppContext.jsx
- `Topbar()` --calls--> `useAppContext()`  [INFERRED]
  Frontend\src\components\layout\Topbar.jsx → Frontend\src\context\AppContext.jsx
- `useAppContext()` --calls--> `Dashboard()`  [INFERRED]
  Frontend\src\context\AppContext.jsx → Frontend\src\pages\Dashboard.jsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (19): call_ollama(), chunk_text(), extract_pdf_text(), generate_explanation_llm(), generate_notes_llm(), generate_quiz_llm(), get_cached_notes(), get_cached_quiz() (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (9): useAppContext(), Dashboard(), DebugPanel(), Leaderboard(), Notes(), Quiz(), Results(), Topbar() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.28
Nodes (12): BaseModel, ExplanationSchema, LearnerStateSchema, MetaSchema, NotesData, QuizQuestionData, RecommendationData, ResponseWrapper (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.51
Nodes (10): assertSuccess(), delay(), generateUUID(), getNotes(), getQuiz(), logTiming(), request(), submitAnswer() (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.33
Nodes (6): Base, Note, QuizQuestion, ResponseEvent, Session, TopicMastery

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (1): test_full_pipeline_with_mock_pdf()

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (1): Splits text into logical chunks of fixed size.

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (1): Simulates LLM extracting 2-3 topics from a chunk.

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (1): Merges topics from multiple chunks, limits to 6 max, and deduplicates.

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (1): Checks if the extracted topics follow the required schema.

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (1): Generates natural questions ONLY from the final merged topics.

## Knowledge Gaps
- **8 isolated node(s):** `Enhanced Quiz Generation (Trap questions enabled).`, `Data-driven Intelligence Layer (Hardcoded overrides removed).`, `Requirement 4: Strengthened Post-Quiz Fallback.`, `Splits text into logical chunks of fixed size.`, `Simulates LLM extracting 2-3 topics from a chunk.` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 5`** (4 nodes): `test_pipeline.py`, `test_full_pipeline_with_mock_pdf()`, `test_grounding_consistency()`, `test_sentence_filtering()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `Splits text into logical chunks of fixed size.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `Simulates LLM extracting 2-3 topics from a chunk.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `Merges topics from multiple chunks, limits to 6 max, and deduplicates.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `Checks if the extracted topics follow the required schema.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `Generates natural questions ONLY from the final merged topics.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `process_pdf_pipeline()` connect `Community 0` to `Community 5`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `test_full_pipeline_with_mock_pdf()` connect `Community 5` to `Community 0`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `useAppContext()` (e.g. with `DebugPanel()` and `Topbar()`) actually correct?**
  _`useAppContext()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `process_pdf_pipeline()` (e.g. with `upload_file()` and `test_full_pipeline_with_mock_pdf()`) actually correct?**
  _`process_pdf_pipeline()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Enhanced Quiz Generation (Trap questions enabled).`, `Data-driven Intelligence Layer (Hardcoded overrides removed).`, `Requirement 4: Strengthened Post-Quiz Fallback.` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._