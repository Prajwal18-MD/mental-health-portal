# backend/src/routes/bookings.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from sqlmodel import Session # type: ignore
from ..database import get_session
from ..crud_bookings import create_booking, list_bookings, get_booking, update_booking
from ..routes.auth import get_current_user
from ..models import Booking  # optional, for typing/clarity

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

class BookingIn(BaseModel):
    patient_id: int
    therapist_id: Optional[int] = None
    datetime: str  # accept ISO string, validate below
    notes: Optional[str] = None

class BookingPatch(BaseModel):
    datetime: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

def _parse_datetime(dt_str: str) -> datetime:
    try:
        # Try parsing ISO format
        return datetime.fromisoformat(dt_str)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid datetime format: {dt_str}. Use ISO format like 2026-01-05T10:30:00")

@router.post("", response_model=dict)
def post_booking(payload: BookingIn, current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Create a booking.
    - If the caller is a therapist, therapist_id defaults to current_user.id when not provided.
    - If the caller is a patient, therapist_id must be provided (booking request).
    """
    # Resolve therapist_id
    if current_user.role == "therapist":
        therapist_id = payload.therapist_id or current_user.id
    elif current_user.role == "patient":
        therapist_id = payload.therapist_id
        if not therapist_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="therapist_id is required when a patient requests a booking")
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only patients and therapists may create bookings")

    # Validate datetime
    dt = _parse_datetime(payload.datetime)

    try:
        b = create_booking(session, patient_id=payload.patient_id, therapist_id=therapist_id, dt=dt, notes=payload.notes)
        # return a plain dict so FastAPI's response_model=dict validation succeeds
        return b.dict()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Could not create booking: {str(e)}")

@router.get("", response_model=List[dict])
def get_bookings(therapist_id: Optional[int] = None, patient_id: Optional[int] = None, status: Optional[str] = None, current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    - Therapists: may query their own bookings (therapist_id can be omitted).
    - Patients: may only query their own bookings (patient_id ignored if caller is a patient).
    """
    if current_user.role == "therapist":
        tid = therapist_id or current_user.id
        rows = list_bookings(session, therapist_id=tid, patient_id=patient_id, status=status)
        return [r.dict() for r in rows]
    elif current_user.role == "patient":
        # force patient_id to current user
        rows = list_bookings(session, patient_id=current_user.id, status=status)
        return [r.dict() for r in rows]
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

@router.patch("/{booking_id}", response_model=dict)
def patch_booking(booking_id: int, payload: BookingPatch, current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Only a therapist who owns the booking may update it.
    """
    b = get_booking(session, booking_id)
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    if current_user.role != "therapist" or b.therapist_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the owning therapist may modify this booking")

    patch = {}
    if payload.datetime is not None:
        patch["datetime"] = _parse_datetime(payload.datetime)
    if payload.status is not None:
        patch["status"] = payload.status
    if payload.notes is not None:
        patch["notes"] = payload.notes

    try:
        updated = update_booking(session, booking_id, **patch)
        return updated.dict()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Could not update booking: {str(e)}")
