from sqlmodel import select # type: ignore
from .models import Mood
from .database import get_session
from datetime import datetime, timedelta
from typing import List

def create_mood(session, user_id: int, text: str, mood_value: int, date: datetime = None, sentiment: float = None, risk: str = None):
    m = Mood(user_id=user_id, text=text, mood_value=mood_value, date=(date or datetime.utcnow()), sentiment=sentiment, risk=risk)
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
    avg = sum(r.mood_value for r in rows)/len(rows)
    return round(avg, 2)
