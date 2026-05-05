from fastapi import FastAPI, Depends, HTTPException
from app.schemas import pydantic_schemas as schemas
from app.services import logic
from typing import List
from uuid import UUID

app = FastAPI(title="Gopalan Hackathon AI Learning API")

@app.get("/")
def read_root():
    return {"status": "success", "message": "API is LIVE and Deterministic"}

@app.post("/upload", response_model=schemas.ResponseWrapper[schemas.TranscriptData])
def upload_video():
    asset = logic.load_demo_asset("transcript")
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    data = {
        "session_id": asset["session_id"],
        "transcript_text": asset["raw_text"],
        "processing_time_ms": 1200
    }
    return {"data": data}

@app.get("/notes/{session_id}", response_model=schemas.ResponseWrapper[schemas.NotesData])
def get_notes(session_id: str):
    asset = logic.load_demo_asset("notes")
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    data = {
        "note_id": asset["note_id"],
        "topic_title": asset["topic"],
        "content_markdown": asset["summary_md"],
        "key_highlights": asset["key_concepts"]
    }
    return {"data": data}

@app.get("/quiz/{session_id}", response_model=schemas.ResponseWrapper[List[schemas.QuizQuestionData]])
def get_quiz(session_id: str):
    asset = logic.load_demo_asset("quiz")
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    data = [
        {
            "q_id": q["q_id"],
            "question_text": q["question"],
            "options": q["options"]
        } for q in asset
    ]
    return {"data": data}

@app.post("/submit/{session_id}", response_model=schemas.ResponseWrapper[schemas.SubmitResponseData])
def submit_answer(session_id: str, request: schemas.SubmitRequest):
    data = logic.get_deterministic_intelligence(session_id)
    return {"data": data}
