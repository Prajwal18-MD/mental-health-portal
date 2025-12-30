from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from sqlmodel import Session
from ..database import get_session
from ..crud_mood import create_mood, list_moods_for_user, avg_mood_for_user
from ..routes.auth import get_current_user
from ..ml.sentiment import analyze_text
from ..ml.risk import detect_risk

router = APIRouter(prefix="/api/mood", tags=["mood"])

class MoodIn(BaseModel):
    text: Optional[str] = None
    mood_value: int = Field(..., ge=1, le=10)
    date: Optional[datetime] = None

class MoodOut(BaseModel):
    id: int
    user_id: int
    text: Optional[str]
    mood_value: int
    date: datetime
    sentiment: Optional[float]
    risk: Optional[str]

@router.post("", response_model=MoodOut)
def post_mood(payload: MoodIn, current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    # run sentiment analysis (compound)
    scores = analyze_text(payload.text or "")
    compound = float(scores.get("compound", 0.0))
    # run risk detection
    mood_val = payload.mood_value
    risk_level, explanation = detect_risk(payload.text or "", compound, mood_val)
    # create mood entry with sentiment & risk
    m = create_mood(session, user_id=current_user.id, text=payload.text, mood_value=payload.mood_value, date=payload.date, sentiment=compound, risk=risk_level)
    return m

@router.get("", response_model=list[MoodOut])
def get_moods(current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    rows = list_moods_for_user(session, user_id=current_user.id, limit=500)
    return rows

@router.get("/analytics")
def get_analytics(current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    avg7 = avg_mood_for_user(session, current_user.id, days=7)
    avg30 = avg_mood_for_user(session, current_user.id, days=30)
    return {"avg_7_days": avg7, "avg_30_days": avg30}
