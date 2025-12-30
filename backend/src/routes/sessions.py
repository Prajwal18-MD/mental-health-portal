# backend/src/routes/sessions.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlmodel import Session
from ..database import get_session
from ..crud_sessions import create_session, list_sessions
from ..deps import require_role

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

class SessionIn(BaseModel):
    booking_id: Optional[int] = None
    patient_id: int
    therapist_id: int
    notes: Optional[str] = None
    outcome: Optional[str] = None

@router.post("", response_model=dict)
def post_session(payload: SessionIn, current_user = Depends(require_role("therapist")), session: Session = Depends(get_session)):
    s = create_session(session, payload.booking_id, payload.patient_id, payload.therapist_id, payload.notes, payload.outcome)
    return s

@router.get("", response_model=list)
def get_sessions(patient_id: Optional[int] = None, therapist_id: Optional[int] = None, current_user = Depends(require_role("therapist")), session: Session = Depends(get_session)):
    rows = list_sessions(session, patient_id=patient_id, therapist_id=therapist_id)
    return rows
