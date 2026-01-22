from sqlmodel import select # type: ignore
from .models import Mood
from .database import get_session
from datetime import datetime, timedelta
from typing import List
from fastapi import HTTPException, status

def create_mood(session, user_id: int, text: str, date: datetime = None, sentiment: float = None, risk: str = None):
    """
    Create a mood entry. Multiple entries per day are allowed.
    """
        
    m = Mood(user_id=user_id, text=text, date=(date or datetime.utcnow()), sentiment=sentiment, risk=risk)
    session.add(m)
    session.commit()
    session.refresh(m)
    return m

def list_moods_for_user(session, user_id: int, limit: int = 100):
    statement = select(Mood).where(Mood.user_id == user_id).order_by(Mood.date.desc()).limit(limit)
    return session.exec(statement).all()

def avg_mood_for_user(session, user_id:int, days:int = 7):
    cutoff = datetime.utcnow() - timedelta(days=days)
    statement = select(Mood).where(Mood.user_id == user_id).where(Mood.date >= cutoff)
    rows = session.exec(statement).all()
    if not rows:
        return None
    avg = sum(r.sentiment or 0.0 for r in rows)/len(rows)
    return round(avg, 2)
