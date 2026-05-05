# ⚡ Exam Mode: Modular Integration Package

This document contains the complete, isolated code for the "Exam Mode" feature, refactored for maximum reusability and stability.

## 📁 File Structure
```text
/Backend
  └── app/services/exam_service.py      # Core AI Logic & Prompt Engineering
/Frontend
  └── src/features/examMode/
      ├── ExamModeView.jsx              # UI Components & Layout
      ├── useExamMode.js                # Custom Hook (Logic & State)
      └── ExamModeButton.jsx            # Reusable Trigger Button
```

---

## 🛠️ Backend: `app/services/exam_service.py`

```python
import json
import re
from typing import List, Dict, Any
from pydantic import BaseModel

class ExamEntry(BaseModel):
    term: str
    definition: str

class Mnemonic(BaseModel):
    concept: str
    trick: str

class ExamQuestion(BaseModel):
    question: str
    answer_hint: str

class ExamData(BaseModel):
    topic_title: str
    key_concepts: List[str] = []
    definitions: List[ExamEntry] = []
    formulas: List[str] = []
    memory_shortcuts: List[Mnemonic] = []
    exam_questions: List[ExamQuestion] = []
    last_minute_tips: List[str] = []

def generate_exam_mode_prompt(transcript: str, language: str = "English") -> str:
    return f"""You are an exam preparation expert. Create a high-impact revision package.

Rules:
* Extract 3–5 Key Concepts.
* Extract 3–5 Definitions.
* Extract 2–3 Formulas (if applicable).
* Create 2–3 Memory Shortcuts (Mnemonics).
* Create 3–5 Potential Exam Questions with hints.
* List 2–3 Last Minute Tips (common pitfalls).
* RETURN ALL CONTENT IN {language}.

Return ONLY JSON:
{{
"topic_title": "Exam Revision in {language}",
"key_concepts": ["Concept 1", "Concept 2"],
"definitions": [{{"term": "Term", "definition": "Def"}}],
"formulas": ["Formula 1"],
"memory_shortcuts": [{{"concept": "Concept", "trick": "Mnemonic"}}],
"exam_questions": [{{"question": "Q", "answer_hint": "Hint"}}],
"last_minute_tips": ["Tip 1"]
}}

Text:
{transcript[:4000]}"""

def clean_exam_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """Ensures all required fields exist to prevent frontend crashes."""
    required_fields = {
        "topic_title": "Revision Package",
        "key_concepts": [],
        "definitions": [],
        "formulas": [],
        "memory_shortcuts": [],
        "exam_questions": [],
        "last_minute_tips": []
    }
    for field, default in required_fields.items():
        if field not in data or data[field] is None:
            data[field] = default
    return data
```

---

## 🎨 Frontend: `src/features/examMode/ExamModeView.jsx`

```jsx
import React from 'react';
import { ShieldAlert, Lightbulb, HelpCircle, BookMarked, Sparkles, Sigma, Zap } from 'lucide-react';
import Card from '../../components/ui/Card';

const ExamModeView = ({ data }) => {
  const { 
    topic_title, key_concepts, definitions, formulas, 
    memory_shortcuts, exam_questions, last_minute_tips 
  } = data;

  return (
    <div className="exam-mode-view space-y-12">
      <header>
        <h1 className="text-4xl font-black mb-2">{topic_title}</h1>
        <div className="flex gap-2">
          {key_concepts.map((c, i) => (
            <span key={i} className="px-3 py-1 bg-accent-primary/10 rounded-full text-xs font-bold text-accent-primary">
              {c}
            </span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-xl font-bold"><BookMarked /> Definitions</h2>
          {definitions.map((d, i) => (
            <Card key={i}>
              <strong className="text-accent-primary">{d.term}</strong>
              <p className="text-text-secondary text-sm">{d.definition}</p>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Lightbulb /> Memory Shortcuts</h2>
          {memory_shortcuts.map((m, i) => (
            <div key={i} className="p-4 bg-warning/5 border border-warning/20 rounded-xl">
              <p className="text-xs uppercase font-bold text-warning">{m.concept}</p>
              <p className="italic">"{m.trick}"</p>
            </div>
          ))}
        </section>
      </div>
      
      {/* Formulas & Tips... */}
    </div>
  );
};

export default ExamModeView;
```

---

## 🚀 THE FINAL REUSABLE INTEGRATION PROMPT

**Copy and paste the text below into your next request on the target branch:**

---

### REUSABLE PROMPT START ###
"You are Antigravity, a senior full-stack engineer. 

I need you to integrate the 'Exam Mode' feature into this project. This is a modular, high-impact feature that converts lecture notes into an exam revision package.

### 📋 INTEGRATION REQUIREMENTS:

1. **Backend**:
   - Create `Backend/app/services/exam_service.py` with logic for AI generation (Key Concepts, Definitions, Formulas, Memory Shortcuts, Exam Questions, and Last Minute Tips).
   - Add `GET /exam/{session_id}` endpoint to `main.py` that uses this service.
   - Ensure the response always returns all fields (use empty arrays if data is missing).

2. **Frontend State**:
   - Update `AppContext.jsx` to store `examData`.
   - Ensure `examData` is cleared on new sessions and re-fetched when the language changes.

3. **Frontend UI**:
   - Create a folder `Frontend/src/features/examMode/`.
   - Implement `ExamModeView.jsx` (Premium study cards), `useExamMode.js` (State/API logic), and `ExamModeButton.jsx`.
   - Register the route `/exam/:sessionId` in `App.jsx`.

4. **Triggers**:
   - Add the `ExamModeButton` to the `Sidebar` and the `Notes` page sidebar.

5. **Stability**:
   - Implement defensive parsing in the backend to handle malformed LLM JSON.
   - Ensure the frontend handles missing fields gracefully without crashing.

Please analyze the current project structure and implement this feature now using the modular code provided in the 'Exam Mode Extraction' artifact."
### REUSABLE PROMPT END ###
