# backend/src/routes/bookings.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from sqlmodel import Session
from ..database import get_session
from ..crud_bookings import create_booking, list_bookings, get_booking, update_booking
from ..deps import require_role

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

class BookingIn(BaseModel):
    patient_id: int
    therapist_id: int
    datetime: datetime
    notes: Optional[str] = None

class BookingPatch(BaseModel):
    datetime: Optional[datetime] = None
    status: Optional[str] = None
    notes: Optional[str] = None

@router.post("", response_model=dict)
def post_booking(payload: BookingIn, current_user = Depends(require_role("therapist")), session: Session = Depends(get_session)):
    b = create_booking(session, payload.patient_id, payload.therapist_id, payload.datetime, payload.notes)
    return b

@router.get("", response_model=list)
def get_bookings(therapist_id: Optional[int] = None, patient_id: Optional[int] = None, status: Optional[str] = None, current_user = Depends(require_role("therapist")), session: Session = Depends(get_session)):
    rows = list_bookings(session, therapist_id=therapist_id, patient_id=patient_id, status=status)
    return rows

@router.patch("/{booking_id}", response_model=dict)
def patch_booking(booking_id: int, payload: BookingPatch, current_user = Depends(require_role("therapist")), session: Session = Depends(get_session)):
    patch = {}
    if payload.datetime is not None:
        patch["datetime"] = payload.datetime
    if payload.status is not None:
        patch["status"] = payload.status
    if payload.notes is not None:
        patch["notes"] = payload.notes
    b = update_booking(session, booking_id, **patch)
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    return b
