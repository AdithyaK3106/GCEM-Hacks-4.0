from pydantic import BaseModel, Field
from typing import List, Optional, Any, Generic, TypeVar
from uuid import UUID
from datetime import datetime

T = TypeVar("T")

class MetaSchema(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    version: str = "1.0.0"

class ResponseWrapper(BaseModel, Generic[T]):
    status: str = "success"
    data: T
    meta: MetaSchema = Field(default_factory=MetaSchema)

# --- Data Models ---

class TranscriptData(BaseModel):
    session_id: UUID
    transcript_text: str
    processing_time_ms: int

class NotesData(BaseModel):
    note_id: int
    topic_title: str
    content_markdown: str
    key_highlights: List[str]

class QuizQuestionData(BaseModel):
    q_id: int
    question_text: str
    options: List[str]

class LearnerStateSchema(BaseModel):
    state_label: str  # MASTERED, MISCONCEPTION, etc.
    state_color: str  # green, red, etc.
    message: str
    action_label: str

class ExplanationSchema(BaseModel):
    text: str
    misconception_warning: Optional[str] = None

class RecommendationData(BaseModel):
    next_step: str  # ADVANCE, RETEACH, etc.
    label: str
    type: str  # challenge, practice, etc.

class SubmitRequest(BaseModel):
    q_id: int
    selected_index: int
    confidence: float
    time_spent_seconds: int

class SubmitResponseData(BaseModel):
    is_correct: bool
    correct_index: int
    learner_state: LearnerStateSchema
    explanation: ExplanationSchema
    recommendation: RecommendationData
