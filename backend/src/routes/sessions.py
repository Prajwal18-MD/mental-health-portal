# backend/src/routes/sessions.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from sqlmodel import Session # type: ignore
from ..database import get_session
from ..crud_sessions import create_session, list_sessions
from ..routes.auth import get_current_user
from ..models import Session as SessionModel  # optional alias

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

class SessionIn(BaseModel):
    booking_id: Optional[int] = None
    patient_id: int
    therapist_id: Optional[int] = None
    notes: Optional[str] = None
    outcome: Optional[str] = None
    session_at: Optional[str] = None  # ISO string

def _parse_dt_opt(dt_str: Optional[str]):
    if not dt_str:
        return None
    try:
        return datetime.fromisoformat(dt_str)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid session_at format: {dt_str}. Use ISO format like 2026-01-05T11:30:00")

@router.post("", response_model=dict)
def post_session(payload: SessionIn, current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Only therapists may record sessions. If therapist_id not provided and caller is a therapist,
    therapist_id defaults to current_user.id
    """
    if current_user.role != "therapist":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only therapists can create session records")

    therapist_id = payload.therapist_id or current_user.id
    session_at = _parse_dt_opt(payload.session_at)

    try:
        s = create_session(session, payload.booking_id, payload.patient_id, therapist_id, payload.notes, payload.outcome, session_at)
        return s.dict()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Could not create session: {str(e)}")

@router.get("", response_model=List[dict])
def get_sessions(patient_id: Optional[int] = None, therapist_id: Optional[int] = None, current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Therapist: may query their sessions (therapist_id defaults to current_user.id)
    Patient: may query their sessions (patient_id defaults to current_user.id)
    """
    if current_user.role == "therapist":
        tid = therapist_id or current_user.id
        rows = list_sessions(session, patient_id=patient_id, therapist_id=tid)
        return [r.dict() for r in rows]
    elif current_user.role == "patient":
        rows = list_sessions(session, patient_id=current_user.id)
        return [r.dict() for r in rows]
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
