import json
import os
import logging
import time
import re
from typing import Dict, Any, Optional, List
from pydantic import ValidationError
from pypdf import PdfReader
from ..schemas import pydantic_schemas

logger = logging.getLogger("SystemHardening")

# --- FALLBACK ASSETS ---
FALLBACK_TOPICS = [
    {
        "name": "Neural Network Fundamentals",
        "summary": "An introduction to biologically inspired computing models that learn from data patterns.",
        "key_concepts": ["Input/Hidden/Output Layers", "Weight updates via Backpropagation", "Activation functions for non-linearity"]
    },
    {
        "name": "Gradient Descent",
        "summary": "An optimization algorithm used to minimize loss by iteratively moving towards the steepest descent.",
        "key_concepts": ["Learning rate hyperparameter", "Cost function minimization", "Convergence and local minima"]
    }
]

FALLBACK_NOTES = {
    "note_id": 999,
    "topic_title": "AI Learning (Recovery Mode)",
    "topics": FALLBACK_TOPICS,
    "content_markdown": "Recovery mode active. Using high-quality default curriculum.",
    "key_highlights": ["Biological inspiration", "Backpropagation", "Optimization"]
}

FALLBACK_QUIZ = [
    { "q_id": 1, "question_text": "How do weights get updated during training?", "options": ["K-Means", "Gradient Descent", "PCA", "Dijkstra"], "source_text": "Training uses backpropagation and gradient descent." },
    { "q_id": 2, "question_text": "Which layer is responsible for receiving raw input?", "options": ["Hidden", "Output", "Input", "Processing"], "source_text": "Layers include Input, Hidden, and Output layers." }
]

session_store = {}
demo_counters = {}

def clean_text(text: str) -> str:
    if not text: return ""
    text = re.sub(r'--- Page \d+ ---', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\x20-\x7E]', '', text)
    return text.strip()

# --- STEP 1: LOGICAL CHUNKING ---
def split_into_chunks(text: str, max_words: int = 600) -> List[str]:
    """Splits text into logical chunks of fixed size."""
    words = text.split()
    # Limit to 6000 words total for demo safety
    words = words[:6000]
    return [" ".join(words[i:i + max_words]) for i in range(0, len(words), max_words)]

# --- STEP 2: STRUCTURED EXTRACTION ---
def extract_structured_topics(chunk: str) -> List[Dict[str, Any]]:
    """Simulates LLM extracting 2-3 topics from a chunk."""
    # Split chunk into sentences to find anchors
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', chunk) if len(s.strip()) > 30]
    
    if not sentences: return []
    
    topics = []
    # Take first 2 anchors to avoid overcrowding
    anchors = sentences[:2]
    for i, s in enumerate(anchors):
        name = s[:40].replace(".", "").strip()
        summary = f"This section discusses {s[:100]}... analyzing its core components and educational significance."
        concepts = [s[:60], "Key technical implication", "Related methodology"]
        
        topics.append({
            "name": name,
            "summary": summary,
            "key_concepts": concepts
        })
    return topics

# --- STEP 3: MERGE & DEDUPLICATE ---
def merge_topic_outputs(topic_lists: List[List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    """Merges topics from multiple chunks, limits to 6 max, and deduplicates."""
    all_topics = []
    seen_names = set()
    
    for sublist in topic_lists:
        for t in sublist:
            name_norm = t["name"].lower()[:20]
            if name_norm not in seen_names:
                all_topics.append(t)
                seen_names.add(name_norm)
                
    return all_topics[:6] # Hard limit 6 topics (Requirement 5)

def validate_notes_schema(topics: List[Dict[str, Any]]) -> bool:
    """Checks if the extracted topics follow the required schema."""
    if not topics: return False
    for t in topics:
        if not all(k in t for k in ("name", "summary", "key_concepts")): return False
        if not isinstance(t["key_concepts"], list): return False
    return True

def extract_pdf_text(file) -> str:
    try:
        reader = PdfReader(file)
        text = ""
        for page in reader.pages[:40]:
            try:
                page_text = page.extract_text()
                if page_text: text += page_text + " "
            except Exception: continue
        return text
    except Exception: return ""

def generate_quiz_from_topics(topics: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generates natural questions ONLY from the final merged topics."""
    quiz = []
    for i, t in enumerate(topics[:5]):
        quiz.append({
            "q_id": i + 1,
            "question_text": f"Regarding '{t['name']}', what is a primary concept mentioned in the summary?",
            "options": [
                t["key_concepts"][0],
                "A distractor concept",
                "An unrelated detail",
                "None of the above"
            ],
            "source_text": t["summary"]
        })
    return quiz

def process_pdf_pipeline(session_id: str, file) -> Dict[str, Any]:
    print("[PIPELINE] Initializing Structured Topic Pipeline...")
    raw_text = extract_pdf_text(file)
    
    if not raw_text or len(raw_text) < 500:
        print("USING FALLBACK (Reason: PDF too short)")
        session_store[session_id] = {"notes": FALLBACK_NOTES, "quiz": FALLBACK_QUIZ, "transcript": "Fallback Transcript"}
        return session_store[session_id]

    try:
        # Step 1: Chunking
        clean = clean_text(raw_text)
        chunks = split_into_chunks(clean)
        
        # Step 2: Extraction (Per Chunk)
        chunk_results = []
        for chunk in chunks[:5]: # Process up to 5 chunks for speed
            topics = extract_structured_topics(chunk)
            if validate_notes_schema(topics):
                chunk_results.append(topics)
        
        # Step 3: Merge & Deduplicate
        final_topics = merge_topic_outputs(chunk_results)
        
        # Step 4: Validation
        if not final_topics:
            print("USING FALLBACK (Reason: Topic extraction failed validation)")
            session_store[session_id] = {"notes": FALLBACK_NOTES, "quiz": FALLBACK_QUIZ, "transcript": clean[:5000]}
            return session_store[session_id]

        # Final Packaging
        final_notes = {
            "note_id": int(time.time()),
            "topic_title": f"Summary: {final_topics[0]['name']}",
            "topics": final_topics,
            "content_markdown": "# Course Overview\n\nNotes synthesized into structured topics.",
            "key_highlights": [t["name"] for t in final_topics]
        }
        
        quiz = generate_quiz_from_topics(final_topics)
        
        session_store[session_id] = {
            "notes": final_notes,
            "quiz": quiz,
            "transcript": clean[:8000]
        }
        print(f"PIPELINE COMPLETE. TOPICS EXTRACTED: {len(final_topics)}")
        return session_store[session_id]

    except Exception as e:
        logger.error(f"Pipeline crashed: {e}")
        session_store[session_id] = {"notes": FALLBACK_NOTES, "quiz": FALLBACK_QUIZ, "transcript": "Error recovery transcript"}
        return session_store[session_id]

# --- CACHE HELPERS ---
def get_cached_notes(session_id: str):
    return session_store.get(session_id, {}).get("notes", FALLBACK_NOTES)

def get_cached_quiz(session_id: str):
    return session_store.get(session_id, {}).get("quiz", FALLBACK_QUIZ)

def get_deterministic_intelligence(session_id: str) -> Dict[str, Any]:
    count = demo_counters.get(session_id, 0)
    demo_counters[session_id] = count + 1
    if count == 0:
        return {
            "is_correct": True, "correct_index": 0,
            "learner_state": { "state_label": "MASTERED", "state_color": "green", "message": "Mastered!", "action_label": "Continue" },
            "explanation": { "text": "Correct.", "misconception_warning": None },
            "recommendation": { "next_step": "ADVANCE", "label": "Next Topic", "type": "challenge" }
        }
    return {
        "is_correct": False, "correct_index": 0,
        "learner_state": { "state_label": "MISCONCEPTION", "state_color": "red", "message": "Wait!", "action_label": "Review" },
        "explanation": { "text": "Incorrect.", "misconception_warning": "High confidence error" },
        "recommendation": { "next_step": "RETEACH", "label": "Review Basics", "type": "reteach" }
    }
