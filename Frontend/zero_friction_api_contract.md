# Zero-Friction API Contract (Frontend Guide)

This document defines the exact contract between the Backend and Frontend. All responses are standardized for immediate rendering.

## 1. Global Response Structure

Every API response follows this shape:

```json
{
  "status": "success",
  "data": {},
  "meta": {
    "timestamp": "2024-05-05T10:00:00Z",
    "version": "1.0.0"
  }
}
```

## 2. API Endpoints

### [POST] `/upload`
*   **Request**: None (Multipart file)
*   **Response `data`**:
    ```json
    {
      "session_id": "uuid-string",
      "transcript_text": "Photosynthesis is...",
      "processing_time_ms": 1200
    }
    ```

### [GET] `/notes/{session_id}`
*   **Response `data`**:
    ```json
    {
      "note_id": 1,
      "topic_title": "Photosynthesis",
      "content_markdown": "# Summary...",
      "key_highlights": ["Chlorophyll", "Stroma"]
    }
    ```

### [GET] `/quiz/{session_id}`
*   **Response `data`**:
    ```json
    [
      {
        "q_id": 101,
        "question_text": "Where does X happen?",
        "options": ["A", "B", "C", "D"]
      }
    ]
    ```

### [POST] `/submit/{session_id}`
*   **Request Body**:
    ```json
    {
      "q_id": 101,
      "selected_index": 2,
      "confidence": 0.9,
      "time_spent_seconds": 15
    }
    ```
*   **Response `data`**:
    ```json
    {
      "is_correct": true,
      "correct_index": 2,
      "learner_state": {
        "state_label": "MASTERED",
        "state_color": "green",
        "message": "You're a concept pro!",
        "action_label": "Next Topic"
      },
      "explanation": {
        "text": "The thylakoid is where...",
        "misconception_warning": null
      },
      "recommendation": {
        "next_step": "ADVANCE",
        "label": "Start Advanced Level",
        "type": "challenge"
      }
    }
    ```

## 3. Strict Enums

### Learner States (`state_label` / `state_color`)
*   `MASTERED` -> `green`
*   `MISCONCEPTION` -> `red`
*   `DEVELOPING` -> `blue`
*   `UNCERTAIN` -> `yellow`
*   `WEAK` -> `orange`

### Action Types (`type`)
*   `reteach`
*   `practice`
*   `challenge`

## 4. Deterministic Demo Behavior
The backend is hard-coded for the demo:
1.  **First Submit**: Always returns `MASTERED`.
2.  **Second Submit**: Always returns `MISCONCEPTION` (Wrong + High Confidence).

## 5. UI Rendering Checklist
*   [ ] Bind `content_markdown` to a Markdown renderer.
*   [ ] Use `state_color` for the "Status Badge" background color.
*   [ ] Trigger a Modal/Overlay if `state_label === "MISCONCEPTION"`.
*   [ ] Bind `action_label` to the primary "Next Step" button.
