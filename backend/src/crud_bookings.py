# backend/src/crud_bookings.py
from sqlmodel import select # type: ignore
from .models import Booking
from datetime import datetime

def create_booking(session, patient_id: int, therapist_id: int, dt: datetime, notes: str = None):
    b = Booking(patient_id=patient_id, therapist_id=therapist_id, datetime=dt, notes=notes)
    session.add(b)
    session.commit()
    session.refresh(b)
    return b

def list_bookings(session, therapist_id: int = None, patient_id: int = None, status: str = None, limit: int = 200):
    stmt = select(Booking)
    if therapist_id:
        stmt = stmt.where(Booking.therapist_id == therapist_id)
    if patient_id:
        stmt = stmt.where(Booking.patient_id == patient_id)
    if status:
        stmt = stmt.where(Booking.status == status)
    stmt = stmt.order_by(Booking.datetime.asc()).limit(limit)
    return session.exec(stmt).all()

def get_booking(session, booking_id: int):
    stmt = select(Booking).where(Booking.id == booking_id)
    return session.exec(stmt).first()

def update_booking(session, booking_id: int, **patch):
    b = get_booking(session, booking_id)
    if not b:
        return None
    for k, v in patch.items():
        if hasattr(b, k):
            setattr(b, k, v)
    session.add(b)
    session.commit()
    session.refresh(b)
    return b

def complete_booking(session, booking_id: int, session_notes: str = None, session_outcome: str = None):
    """
    Mark a booking as completed and record session details.
    """
    b = get_booking(session, booking_id)
    if not b:
        return None
    b.status = "completed"
    b.session_notes = session_notes
    b.session_outcome = session_outcome
    b.completed_at = datetime.utcnow()
    session.add(b)
    session.commit()
    session.refresh(b)
    return b
