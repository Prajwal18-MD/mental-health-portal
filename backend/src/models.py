from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from pydantic import constr

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
    mood_value: int = Field(default=5, ge=1, le=10)  # 1-10 scale
    date: datetime = Field(default_factory=datetime.utcnow)
    sentiment: Optional[float] = None   # placeholder for Phase 3
    risk: Optional[str] = None          # placeholder for Phase 3 ("LOW","MEDIUM","HIGH")
