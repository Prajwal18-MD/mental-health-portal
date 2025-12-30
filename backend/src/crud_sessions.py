# backend/src/crud_sessions.py
from sqlmodel import select
from .models import Session as SessionModel

def create_session(session, booking_id: int, patient_id: int, therapist_id: int, notes: str = None, outcome: str = None, session_at=None):
    s = SessionModel(booking_id=booking_id, patient_id=patient_id, therapist_id=therapist_id, notes=notes, outcome=outcome, session_at=(session_at))
    session.add(s)
    session.commit()
    session.refresh(s)
    return s

def list_sessions(session, patient_id: int = None, therapist_id: int = None, limit: int = 200):
    stmt = select(SessionModel)
    if patient_id:
        stmt = stmt.where(SessionModel.patient_id == patient_id)
    if therapist_id:
        stmt = stmt.where(SessionModel.therapist_id == therapist_id)
    stmt = stmt.order_by(SessionModel.session_at.desc()).limit(limit)
    return session.exec(stmt).all()
