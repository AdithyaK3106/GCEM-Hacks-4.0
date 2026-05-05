from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db.database import Base

class Session(Base):
    __tablename__ = "sessions"
    session_id = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Note(Base):
    __tablename__ = "notes"
    note_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.session_id"))
    content = Column(Text)
    topic = Column(String)
    key_concepts = Column(JSON) # Storing list as JSON

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    q_id = Column(Integer, primary_key=True, index=True)
    note_id = Column(Integer, ForeignKey("notes.note_id"))
    question = Column(Text)
    options = Column(JSON) # List of options
    correct_idx = Column(Integer)
    explanation = Column(Text)

class ResponseEvent(Base):
    __tablename__ = "response_events"
    event_id = Column(Integer, primary_key=True, index=True)
    q_id = Column(Integer, ForeignKey("quiz_questions.q_id"))
    selected_idx = Column(Integer)
    is_correct = Column(Boolean)
    confidence = Column(Float)
    time_taken = Column(Integer)

class TopicMastery(Base):
    __tablename__ = "topic_mastery"
    mastery_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.session_id"))
    topic = Column(String)
    score = Column(Float)
