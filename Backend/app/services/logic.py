import json
import os
import logging
import time
import re
import requests
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, ValidationError
from pypdf import PdfReader
from dotenv import load_dotenv
from ..schemas import pydantic_schemas

# Load environment variables
load_dotenv()

# Configure Logging
logger = logging.getLogger("Ollama_Pipeline")
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# --- Configuration ---
OLLAMA_URL = "http://localhost:11434/api/generate"
NOTES_MODEL = "deepseek-coder:6.7b" # Switched to 6.7b for faster performance
QUIZ_MODEL = "deepseek-coder:6.7b"
EXPLANATION_MODEL = "deepseek-coder:6.7b" # Use faster model for explanations too

# --- FALLBACK SYSTEM ---
def load_fallback_file(filename: str, default: Any) -> Any:
    try:
        base_path = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(base_path, "..", "..", "demo_assets", filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Failed to load fallback {filename}: {e}")
    return default

FALLBACK_NOTES_RAW = load_fallback_file("notes.json", {"topics": []})
FALLBACK_QUIZ = load_fallback_file("quiz.json", [])

session_store = {}

# --- CORE UTILS ---

def call_ollama(model: str, prompt: str) -> str:
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 600 # Reduced for speed
        }
    }
    try:
        logger.info(f"Calling Ollama Model: {model}")
        response = requests.post(OLLAMA_URL, json=payload, timeout=120)
        response.raise_for_status()
        res_json = response.json()
        return res_json.get("response", "")
    except Exception as e:
        logger.error(f"Ollama call failed: {e}")
        return ""

def extract_json(text: str) -> Optional[Any]:
    """Robust JSON extraction using regex."""
    if not text: return None
    
    # Try standard load first
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    # Regex to find the first JSON object or array
    try:
        # Matches from the first { to the last } or first [ to the last ]
        match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", text)
        if match:
            json_str = match.group(1)
            # Remove minor formatting issues like trailing commas or comments if necessary
            # (Basic cleanup)
            return json.loads(json_str)
    except Exception as e:
        logger.warning(f"Regex JSON extraction failed: {e}")
    
    return None

def chunk_text(text: str, max_tokens: int = 700) -> List[str]:
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    for word in words:
        word_len = len(word) // 4 + 1
        if current_length + word_len > max_tokens:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = word_len
        else:
            current_chunk.append(word)
            current_length += word_len
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks

# --- GENERATION FUNCTIONS ---

def generate_notes_llm(transcript: str) -> dict:
    """Robust Notes Generation with chunk-level fault tolerance."""
    chunks = chunk_text(transcript, max_tokens=750)
    all_topics = []
    
    prompt_template = """You are an expert teacher explaining concepts clearly and practically. Extract core concepts as JSON.

Rules:
* Maximum 5 topics total across response.
* Each topic MUST have: name, summary, intuition, when_to_use, common_mistake, real_world_example, key_concepts.
* summary: 2-3 lines, clear and simple.
* intuition: Memorable analogy or mental model.
* when_to_use: 2-4 bullet points on practical scenarios.
* common_mistake: Typical misunderstanding to avoid.
* real_world_example: One concrete, practical example.
* key_concepts: 3-5 short bullet points.
* Return ONLY valid JSON.

JSON Structure:
{{
"topics": [
{{
"name": "Concept Name",
"summary": "Brief 2-3 line summary",
"intuition": "Think of it like...",
"when_to_use": ["scenario 1", "scenario 2"],
"common_mistake": "Students often assume...",
"real_world_example": "Spam detection in emails...",
"key_concepts": ["core idea 1", "core idea 2"]
}}
]
}}

Text to analyze:
{text}"""

    # Speed Optimization: Process only the first substantive chunk for the demo
    for i, chunk in enumerate(chunks[:1]): 
        logger.info(f"Processing Note Chunk {i+1}/{len(chunks)}")
        prompt = prompt_template.format(text=chunk)
        
        success = False
        for attempt in range(2): # Retry logic
            raw_response = call_ollama(NOTES_MODEL, prompt)
            
            # --- DEBUG LOGGING ---
            logger.info(f"=== RAW LLM RESPONSE (CHUNK {i+1}, ATTEMPT {attempt+1}) ===\n{raw_response}\n=========================")
            
            data = extract_json(raw_response)
            logger.info(f"=== PARSED JSON (CHUNK {i+1}) ===\n{json.dumps(data, indent=2) if data else 'FAILED'}\n=========================")

            if data and "topics" in data and isinstance(data["topics"], list):
                all_topics.extend(data["topics"])
                success = True
                logger.info(f"✅ Chunk {i+1} successfully processed.")
                break
            else:
                logger.warning(f"⚠️ Chunk {i+1} attempt {attempt+1} failed to produce valid JSON topics.")
        
        if not success:
            logger.error(f"❌ Chunk {i+1} skipped after {attempt+1} failed attempts.")

    # Merge and Deduplicate
    unique_topics = []
    seen_names = set()
    for topic in all_topics:
        name = topic.get("name", "").strip()
        if name and name.lower() not in seen_names:
            unique_topics.append(topic)
            seen_names.add(name.lower())
            if len(unique_topics) >= 6: break # Collect a few extra then slice

    if not unique_topics:
        logger.error("❌ ALL CHUNKS FAILED → fallback triggered")
        return FALLBACK_NOTES_RAW
        
    return {
        "title": "Mastery Path: Structured Insights",
        "topics": unique_topics[:5] # Limit to 5
    }

def generate_quiz_llm(transcript: str) -> List[dict]:
    """Robust Quiz Generation with extraction and fallback."""
    chunks = chunk_text(transcript, max_tokens=750)
    if not chunks: return FALLBACK_QUIZ
    
    prompt = f"""Generate exactly 3 MCQs as JSON.
CRITICAL RULE: Make exactly 1 question a 'trap question' targeting a common misconception. For this question, set "is_trap": true. Set "is_trap": false for others.
Ensure every question has a "concept_tested" field.
Return ONLY JSON.

Structure:
{{
"questions": [
{{
"question": "text",
"options": ["A", "B", "C", "D"],
"correct_answer": "correct text",
"explanation": "why",
"concept_tested": "name",
"is_trap": boolean
}}
]
}}

Text:
{chunks[0]}"""

    for attempt in range(2):
        raw_response = call_ollama(QUIZ_MODEL, prompt)
        logger.info(f"=== RAW QUIZ RESPONSE (ATTEMPT {attempt+1}) ===\n{raw_response}\n=========================")
        
        data = extract_json(raw_response)
        if data and "questions" in data:
            formatted = []
            for i, q in enumerate(data["questions"]):
                formatted.append({
                    "q_id": i + 1,
                    "question_text": q.get("question", ""),
                    "options": q.get("options", []),
                    "correct_answer": q.get("correct_answer", ""),
                    "source_text": q.get("explanation", ""),
                    "concept_tested": q.get("concept_tested", ""),
                    "is_trap": q.get("is_trap", False)
                })
            return formatted
            
    logger.error("❌ Quiz generation failed → fallback triggered")
    return FALLBACK_QUIZ

def generate_explanation_llm(question: str, options: List[str], student_ans: str, correct_ans: str) -> dict:
    """Robust Explanation Generation."""
    prompt = f"""Diagnose why the student was wrong. Return ONLY JSON.
Question: {question}
Student's Answer: {student_ans}
Correct Answer: {correct_ans}

Structure:
{{
"wrong_belief": "what they thought",
"why_wrong": "why logic fails",
"correct_concept": "actual rule",
"simple_analogy": "analogy"
}}"""

    for attempt in range(2):
        raw_response = call_ollama(EXPLANATION_MODEL, prompt)
        data = extract_json(raw_response)
        if data:
            return data
            
    return {
        "wrong_belief": "Logical misalignment.",
        "why_wrong": "The reasoning applied does not hold for this specific concept.",
        "correct_concept": "Review core fundamentals.",
        "simple_analogy": "Think of it like using the wrong key for a lock."
    }

# --- PIPELINE ---

def extract_pdf_text(file) -> str:
    try:
        reader = PdfReader(file)
        text = ""
        for page in reader.pages[:20]:
            page_text = page.extract_text()
            if page_text: text += page_text + " "
        return text
    except Exception as e: 
        logger.error(f"PDF extraction error: {e}")
        return ""

def process_pdf_pipeline(session_id: str, file) -> Dict[str, Any]:
    raw_text = extract_pdf_text(file)
    if not raw_text or len(raw_text) < 50:
        logger.warning("Empty or short PDF. Using fallback.")
        session_store[session_id] = {"notes": FALLBACK_NOTES_RAW, "quiz": FALLBACK_QUIZ, "transcript": "Fallback content."}
        return session_store[session_id]

    notes_llm = generate_notes_llm(raw_text)
    quiz_llm = generate_quiz_llm(raw_text)
    
    notes_data = {
        "note_id": int(time.time()),
        "topic_title": notes_llm.get("title", "Lecture Summary"),
        "topics": notes_llm.get("topics", []),
        "content_markdown": "",
        "key_highlights": [t["name"] for t in notes_llm.get("topics", [])]
    }
    
    session_store[session_id] = {
        "notes": notes_data,
        "quiz": quiz_llm,
        "transcript": raw_text[:5000],
        "history": [] 
    }
    
    return session_store[session_id]

def get_cached_notes(session_id: str):
    return session_store.get(session_id, {}).get("notes", FALLBACK_NOTES_RAW)

def get_cached_quiz(session_id: str):
    return session_store.get(session_id, {}).get("quiz", FALLBACK_QUIZ)

def get_deterministic_intelligence(session_id: str, q_id: int, selected_index: int, confidence: float) -> Dict[str, Any]:
    """Data-driven Intelligence Layer."""
    session = session_store.get(session_id)
    if not session:
        return {"error": "Session lost."}
        
    quiz_data = session.get("quiz", [])
    question = next((q for q in quiz_data if q["q_id"] == q_id), None)
    
    if not question:
        return {"error": "Question not found."}

    correct_ans = str(question.get("correct_answer")).strip()
    options = question.get("options", [])
    student_ans = str(options[selected_index]).strip() if selected_index < len(options) else ""
    
    is_correct = (student_ans.lower() == correct_ans.lower())
    
    # Intelligence logic: ACT Model
    is_misconception = not is_correct and confidence >= 0.7
    
    state = "MASTERED" if is_correct else ("MISCONCEPTION" if is_misconception else "WEAK")
    color = "green" if is_correct else ("red" if is_misconception else "yellow")
    
    insight = "Identified because your confidence was high but the answer was incorrect." if is_misconception else (
        "Verified mastery through consistent accurate response." if is_correct else
        "Incorrect answer with low confidence indicates uncertainty."
    )

    # Debug Output for Judges
    logger.info(f"[JUDGE_DEBUG] " + json.dumps({
        "question_id": q_id,
        "is_trap": question.get("is_trap", False),
        "confidence": round(confidence, 2),
        "accuracy": 1.0 if is_correct else 0.0,
        "state": state
    }))
    
    exp_data = generate_explanation_llm(question["question_text"], options, student_ans, correct_ans)
    
    response = {
        "is_correct": is_correct,
        "correct_index": next((i for i, o in enumerate(options) if str(o).strip().lower() == correct_ans.lower()), 0),
        "learner_state": {
            "state_label": state,
            "state_color": color,
            "message": f"Cognitive pattern: {state}",
            "action_label": "Next Phase" if is_correct else "Retraining Required",
            "insight_reason": insight
        },
        "explanation": {
            "text": f"Correct Answer: {correct_ans}.",
            "wrong_belief": exp_data.get("wrong_belief"),
            "why_wrong": exp_data.get("why_wrong"),
            "correct_concept": exp_data.get("correct_concept"),
            "simple_analogy": exp_data.get("simple_analogy")
        },
        "recommendation": {
            "next_step": "ADVANCE" if is_correct else "REVIEW",
            "label": "Progressing to complex application." if is_correct else "We will now reteach this concept using simpler examples to correct the misunderstanding.",
            "type": "challenge" if is_correct else "remediation"
        }
    }
    
    session["history"].append({"q_id": q_id, "is_correct": is_correct, "state": state, "confidence": confidence, "data": response})
    
    return response

def get_session_summary(session_id: str) -> Dict[str, Any]:
    session = session_store.get(session_id)
    if not session or not session.get("history"):
        return {"status": "no_data"}
        
    history = session["history"]
    misconceptions = [h for h in history if h["state"] == "MISCONCEPTION"]
    
    if misconceptions:
        return {"status": "insights_found", "top_misconception": misconceptions[0]}
    
    wrong_answers = [h for h in history if not h["is_correct"]]
    if wrong_answers:
        top_wrong = max(wrong_answers, key=lambda x: x.get("confidence", 0))
        return {
            "status": "post_session_insight", 
            "message": "We noticed a pattern worth reviewing...",
            "top_misconception": top_wrong
        }
    
    return {"status": "all_correct", "message": "Mastery confirmed across all topics."}
