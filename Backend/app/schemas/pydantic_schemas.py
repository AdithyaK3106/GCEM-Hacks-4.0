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

class Topic(BaseModel):
    name: str
    summary: str
    key_concepts: List[str]
    examples: List[str] = []
    intuition: str = "" # Added for enhanced pedagogy

class NotesData(BaseModel):
    note_id: int
    topic_title: str
    topics: List[Topic] = []
    content_markdown: str = ""
    key_highlights: List[str] = []

class QuizQuestionData(BaseModel):
    q_id: int
    question_text: str
    options: List[str]
    source_text: Optional[str] = None
    concept_tested: Optional[str] = None
    is_trap: bool = False # Identifies questions targeting common pitfalls

class LearnerStateSchema(BaseModel):
    state_label: str
    state_color: str
    message: str
    action_label: str

class ExplanationSchema(BaseModel):
    text: str
    misconception_warning: Optional[str] = None
    wrong_belief: Optional[str] = None
    why_wrong: Optional[str] = None
    correct_concept: Optional[str] = None
    simple_analogy: Optional[str] = None

class RecommendationData(BaseModel):
    next_step: str
    label: str
    type: str

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
