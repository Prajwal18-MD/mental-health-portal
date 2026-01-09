# backend/src/routes/therapist.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select # type: ignore
from ..database import get_session
from ..models import User
from ..routes.auth import get_current_user
from ..deps import require_role
from ..crud_mood import list_moods_for_user, avg_mood_for_user
from ..crud_sessions import list_sessions
from ..crud_bookings import list_bookings

router = APIRouter(prefix="/api/therapist", tags=["therapist"])

@router.get("/patients")
def list_patients(current_user = Depends(require_role("therapist")), session: Session = Depends(get_session)):
    # List all patients with their latest mood & avg mood
    stmt = select(User).where(User.role == "patient")
    patients = session.exec(stmt).all()
    out = []
    for p in patients:
        moods = list_moods_for_user(session, p.id, limit=1)
        latest = moods[0] if moods else None
        avg7 = avg_mood_for_user(session, p.id, days=7)
        avg30 = avg_mood_for_user(session, p.id, days=30)
        out.append({
            "id": p.id,
            "name": p.name,
            "email": p.email,
            "latest_mood_sentiment": latest.sentiment if latest else None,
            "latest_mood_risk": latest.risk if latest else None,
            "avg_7_days": avg7,
            "avg_30_days": avg30
        })
    return out

@router.get("/patient/{patient_id}")
def patient_detail(patient_id: int, current_user = Depends(require_role("therapist")), session: Session = Depends(get_session)):
    p = session.get(User, patient_id)
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    moods = list_moods_for_user(session, p.id, limit=500)
    sessions = list_sessions(session, patient_id=p.id)
    bookings = list_bookings(session, patient_id=p.id)
    return {
        "id": p.id,
        "name": p.name,
        "email": p.email,
        "moods": moods,
        "sessions": sessions,
        "bookings": bookings
    }
