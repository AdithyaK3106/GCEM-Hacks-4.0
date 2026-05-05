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
logging.basicConfig(level=logging.INFO)

# --- Configuration ---
OLLAMA_URL = "http://localhost:11434/api/generate"
NOTES_MODEL = "qwen2.5-coder:14b"
QUIZ_MODEL = "deepseek-coder:6.7b"
EXPLANATION_MODEL = "qwen2.5-coder:14b"

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
            "temperature": 0.2,
            "num_predict": 800
        }
    }
    try:
        logger.info(f"Calling Ollama: {model}")
        response = requests.post(OLLAMA_URL, json=payload, timeout=120)
        response.raise_for_status()
        return response.json().get("response", "")
    except Exception as e:
        logger.error(f"Ollama call failed: {e}")
        return ""

def safe_json_parse(text: str) -> Optional[Any]:
    if not text: return None
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        try:
            match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", text)
            if match:
                return json.loads(match.group(1))
        except Exception:
            return None
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

def generate_notes_llm(transcript: str, language: str = "English") -> dict:
    chunks = chunk_text(transcript, max_tokens=750)
    all_topics = []
    
    prompt_template = """You are an expert teacher.
Your goal is to make complex concepts feel simple and intuitive.

Extract ONLY the most important concepts.

Rules:
* Prioritize teaching clarity over completeness.
* Use simple language (like explaining to a student).
* Maximum 5 topics.
* Each topic MUST include an 'intuition' field.
* IMPORTANT: YOU MUST RETURN ALL CONTENT IN {language}.

Return ONLY JSON:
{{
"topics": [
{{
"name": "Topic Name in {language}",
"summary": "Clear, simple explanation in {language}.",
"key_concepts": ["List of core mechanics in {language}"],
"intuition": "A relatable analogy or simple mental model in {language}. e.g., 'Think of it like...'"
}}
]
}}

Text:
{text}"""

    for chunk in chunks[:2]:
        prompt = prompt_template.format(text=chunk, language=language)
        for attempt in range(2):
            raw = call_ollama(NOTES_MODEL, prompt)
            data = safe_json_parse(raw)
            if data and "topics" in data:
                all_topics.extend(data["topics"])
                break
    
    unique_topics = []
    seen = set()
    for t in all_topics:
        name = t.get("name", "").strip().lower()
        if name and name not in seen:
            unique_topics.append(t)
            seen.add(name)
            if len(unique_topics) >= 5: break
            
    if not unique_topics:
        return FALLBACK_NOTES_RAW
        
    return {
        "title": "Pedagogical Breakdown: Core Concepts",
        "topics": unique_topics
    }

def generate_quiz_llm(transcript: str, language: str = "English") -> List[dict]:
    """Enhanced Quiz Generation (Trap questions enabled)."""
    chunks = chunk_text(transcript, max_tokens=750)
    if not chunks: return FALLBACK_QUIZ
    
    prompt = f"""You are a teacher generating quiz questions.

Rules:
* 3–5 questions only.
* MCQ format (4 options).
* One correct answer.
* Directly tie each question to a specific concept.
* CRITICAL: Include exactly 1 'trap question' that targets a known misconception or common pitfall.
* For the trap question, set "is_trap": true.
* IMPORTANT: YOU MUST RETURN ALL CONTENT IN {language}.

Return ONLY JSON:
{{
"questions": [
{{
"question": "The question text in {language}",
"options": ["Option A in {language}", "Option B in {language}", "Option C in {language}", "Option D in {language}"],
"correct_answer": "The correct text in {language}",
"explanation": "Why this is correct in {language}.",
"concept_tested": "Concept Name in {language}",
"is_trap": boolean
}}
]
}}

Text:
{chunks[0]}"""

    for attempt in range(2):
        raw = call_ollama(QUIZ_MODEL, prompt)
        data = safe_json_parse(raw)
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
            
    return FALLBACK_QUIZ

def generate_explanation_llm(question: str, options: List[str], student_ans: str, correct_ans: str, language: str = "English") -> dict:
    prompt = f"""You are an expert AI tutor. A student answered a question incorrectly.
Your goal is to diagnose their 'wrong belief' and correct it with an analogy.

Question: {question}
Options: {options}
Student's Answer: {student_ans}
Correct Answer: {correct_ans}

Tone: Direct, clear, slightly assertive.
IMPORTANT: YOU MUST RETURN ALL CONTENT IN {language}.

Return ONLY JSON:
{{
"wrong_belief": "Specifically what the student probably thought was true in {language}.",
"why_wrong": "Why that logic fails in this specific context in {language}.",
"correct_concept": "The actual rule or concept they missed in {language}.",
"simple_analogy": "A powerful, simple analogy to make it stick in {language}."
}}"""

    for attempt in range(2):
        raw = call_ollama(EXPLANATION_MODEL, prompt)
        data = safe_json_parse(raw)
        if data:
            return data
            
    return {
        "wrong_belief": "General logical error.",
        "why_wrong": "Incorrect application of concepts.",
        "correct_concept": "Concept review required.",
        "simple_analogy": "None available."
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
    except Exception: return ""

def process_pdf_pipeline(session_id: str, file) -> Dict[str, Any]:
    raw_text = extract_pdf_text(file)
    if not raw_text or len(raw_text) < 50:
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
        "history": [] # Track session history for fallback triggers
    }
    
    return session_store[session_id]

def get_cached_notes(session_id: str, language: str = "English"):
    session = session_store.get(session_id)
    if not session: return FALLBACK_NOTES_RAW
    
    # Simple check: if cached notes are in a different language, we might want to re-generate.
    # For now, let's just trigger generation if it's the first time or if we want to force translation.
    # In a real app, you'd cache per language.
    if "transcript" in session:
        return generate_notes_llm(session["transcript"], language)
    return session.get("notes", FALLBACK_NOTES_RAW)

def get_cached_quiz(session_id: str, language: str = "English"):
    session = session_store.get(session_id)
    if not session: return FALLBACK_QUIZ
    
    if "transcript" in session:
        return generate_quiz_llm(session["transcript"], language)
    return session.get("quiz", FALLBACK_QUIZ)

def get_deterministic_intelligence(session_id: str, q_id: int, selected_index: int, confidence: float = 0.5, language: str = "English") -> Dict[str, Any]:
    """Data-driven Intelligence Layer (Hardcoded overrides removed)."""
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
    
    # Requirement: Explainability logic
    # MISCONCEPTION = Wrong answer + High Confidence
    is_misconception = not is_correct and confidence >= 0.7
    
    state = "MASTERED" if is_correct else ("MISCONCEPTION" if is_misconception else "WEAK")
    color = "green" if is_correct else ("red" if is_misconception else "yellow")
    
    insight = "Identified because your confidence was high but the answer was incorrect." if is_misconception else (
        "Verified mastery through consistent accurate response." if is_correct else
        "Incorrect answer with low confidence indicates uncertainty."
    )

    # Debug Output for Judges (Requirement 6)
    logger.info(f"[JUDGE_DEBUG] " + json.dumps({
        "question_id": q_id,
        "is_trap": question.get("is_trap", False),
        "confidence": round(confidence, 2),
        "accuracy": 1.0 if is_correct else 0.0,
        "state": state
    }))
    
    exp_data = generate_explanation_llm(question["question_text"], options, student_ans, correct_ans, language)
    
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
    
    # Save to history for fallback analysis
    session["history"].append({"q_id": q_id, "is_correct": is_correct, "state": state, "confidence": confidence, "data": response})
    
    return response

def get_session_summary(session_id: str) -> Dict[str, Any]:
    """Requirement 4: Strengthened Post-Quiz Fallback."""
    session = session_store.get(session_id)
    if not session or not session.get("history"):
        return {"status": "no_data"}
        
    history = session["history"]
    misconceptions = [h for h in history if h["state"] == "MISCONCEPTION"]
    
    if misconceptions:
        return {"status": "insights_found", "top_misconception": misconceptions[0]}
    
    # Fallback: Identify highest confidence wrong answer (even if not technically a 'misconception' yet)
    wrong_answers = [h for h in history if not h["is_correct"]]
    if wrong_answers:
        top_wrong = max(wrong_answers, key=lambda x: x.get("confidence", 0))
        return {
            "status": "post_session_insight", 
            "message": "We noticed a pattern worth reviewing...",
            "top_misconception": top_wrong
        }
    
    return {"status": "all_correct", "message": "Mastery confirmed across all topics."}
