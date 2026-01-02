# backend/src/routes/bookings_auto.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select # type: ignore
from datetime import datetime, timedelta

from ..database import get_session
from ..routes.auth import get_current_user
from ..models import User
from ..crud_bookings import create_booking

router = APIRouter(prefix="/api/bookings", tags=["bookings_auto"])

@router.post("/auto", response_model=dict)
def auto_book(current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Auto-create a booking for the calling patient by assigning the first available therapist.
    - Endpoint: POST /api/bookings/auto
    - Caller must be authenticated (patient allowed)
    """
    # Only allow patients to call this (or allow therapists to schedule on behalf later)
    if current_user.role != "patient":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only patients may request an automatic booking via this endpoint")

    # find the first therapist
    stmt = select(User).where(User.role == "therapist").limit(1)
    res = session.exec(stmt).first()
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No therapists available")

    therapist = res
    # schedule time: now + 1 hour (server UTC)
    dt = datetime.utcnow() + timedelta(hours=1)

    try:
        b = create_booking(session, patient_id=current_user.id, therapist_id=therapist.id, dt=dt, notes="Auto-assigned due to high-risk mood entry")
        return b.dict()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to create booking: {str(e)}")
