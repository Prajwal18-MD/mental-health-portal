# backend/src/models.py
from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    hashed_password: str
    role: str = Field(default="patient")  # "patient" or "therapist"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Mood(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    text: Optional[str] = None
    mood_value: int = Field(default=5, ge=1, le=10)
    date: datetime = Field(default_factory=datetime.utcnow)
    sentiment: Optional[float] = None
    risk: Optional[str] = None

class Booking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="user.id")
    therapist_id: int = Field(foreign_key="user.id")
    datetime: datetime
    notes: Optional[str] = None
    status: str = Field(default="scheduled")  # scheduled, cancelled, completed
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Session(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    booking_id: Optional[int] = Field(default=None, foreign_key="booking.id")
    patient_id: int = Field(foreign_key="user.id")
    therapist_id: int = Field(foreign_key="user.id")
    notes: Optional[str] = None
    outcome: Optional[str] = None
    session_at: datetime = Field(default_factory=datetime.utcnow)
