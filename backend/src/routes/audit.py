# backend/src/routes/audit.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, select # type: ignore
from ..database import get_session
from ..deps import require_role
from ..models import Mood

router = APIRouter(prefix="/api/audit", tags=["audit"])

@router.get("/high-risk")
def high_risk_logs(current_user = Depends(require_role("therapist")), session: Session = Depends(get_session)):
    stmt = select(Mood).where(Mood.risk == "HIGH").order_by(Mood.date.desc()).limit(200)
    rows = session.exec(stmt).all()
    return [{"id": r.id, "user_id": r.user_id, "date": r.date.isoformat(), "text": r.text, "sentiment": r.sentiment, "risk": r.risk} for r in rows]
