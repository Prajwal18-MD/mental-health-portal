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