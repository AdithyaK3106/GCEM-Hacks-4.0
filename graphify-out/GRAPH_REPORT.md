# Graph Report - Gopalan Hackathon  (2026-05-05)

## Corpus Check
- 26 files · ~9,911 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 80 nodes · 96 edges · 5 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]

## God Nodes (most connected - your core abstractions)
1. `useAppContext()` - 8 edges
2. `wrap()` - 5 edges
3. `delay()` - 5 edges
4. `assertSuccess()` - 5 edges
5. `request()` - 5 edges
6. `uploadLecture()` - 5 edges
7. `getNotes()` - 5 edges
8. `getQuiz()` - 5 edges
9. `submitAnswer()` - 5 edges
10. `load_demo_asset()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Topbar()` --calls--> `useAppContext()`  [INFERRED]
  Frontend\src\components\layout\Topbar.jsx → Frontend\src\context\AppContext.jsx
- `Dashboard()` --calls--> `useAppContext()`  [INFERRED]
  Frontend\src\pages\Dashboard.jsx → Frontend\src\context\AppContext.jsx
- `Leaderboard()` --calls--> `useAppContext()`  [INFERRED]
  Frontend\src\pages\Leaderboard.jsx → Frontend\src\context\AppContext.jsx
- `Quiz()` --calls--> `useAppContext()`  [INFERRED]
  Frontend\src\pages\Quiz.jsx → Frontend\src\context\AppContext.jsx
- `Results()` --calls--> `useAppContext()`  [INFERRED]
  Frontend\src\pages\Results.jsx → Frontend\src\context\AppContext.jsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (9): useAppContext(), Dashboard(), Leaderboard(), Notes(), renderMarkdown(), Quiz(), Results(), Topbar() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.3
Nodes (11): BaseModel, ExplanationSchema, LearnerStateSchema, MetaSchema, NotesData, QuizQuestionData, RecommendationData, ResponseWrapper (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.31
Nodes (6): get_deterministic_intelligence(), load_demo_asset(), get_notes(), get_quiz(), submit_answer(), upload_video()

### Community 3 - "Community 3"
Cohesion: 0.33
Nodes (6): Base, Note, QuizQuestion, ResponseEvent, Session, TopicMastery

### Community 4 - "Community 4"
Cohesion: 0.67
Nodes (8): assertSuccess(), delay(), getNotes(), getQuiz(), request(), submitAnswer(), uploadLecture(), wrap()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 7 inferred relationships involving `useAppContext()` (e.g. with `Topbar()` and `Dashboard()`) actually correct?**
  _`useAppContext()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._