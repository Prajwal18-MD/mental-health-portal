# backend/src/models.py
from typing import Optional
from sqlmodel import SQLModel, Field # type: ignore
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    hashed_password: str
    role: str = Field(default="patient")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Mood(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    text: Optional[str] = None
    date: datetime = Field(default_factory=datetime.utcnow)
    sentiment: Optional[float] = None
    risk: Optional[str] = None

class Booking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="user.id")
    therapist_id: int = Field(foreign_key="user.id")
    datetime: datetime
    notes: Optional[str] = None
    status: str = Field(default="scheduled")
    session_notes: Optional[str] = None
    session_outcome: Optional[str] = None
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow) # type: ignore

class Session(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    booking_id: Optional[int] = Field(default=None, foreign_key="booking.id")
    patient_id: int = Field(foreign_key="user.id")
    therapist_id: int = Field(foreign_key="user.id")
    notes: Optional[str] = None
    outcome: Optional[str] = None
    session_at: datetime = Field(default_factory=datetime.utcnow)

class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    sender: str = Field(default="user")  # "user" or "bot" or "system"
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
