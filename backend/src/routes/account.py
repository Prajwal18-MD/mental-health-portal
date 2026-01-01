# backend/src/routes/account.py
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlmodel import Session, delete # type: ignore
from ..database import get_session
from ..routes.auth import get_current_user
from ..auth_utils import verify_password
from ..models import User, Mood, ChatMessage, Booking, Session as SessionModel

router = APIRouter(prefix="/api/account", tags=["account"])

class DeleteBody(BaseModel):
    password: str

@router.delete("", status_code=204)
def delete_account(payload: DeleteBody, current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    user = session.get(User, current_user.id)
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid password")

    session.exec(delete(Mood).where(Mood.user_id == user.id))
    session.exec(delete(ChatMessage).where(ChatMessage.user_id == user.id))
    session.exec(delete(Booking).where(Booking.patient_id == user.id))
    session.exec(delete(Booking).where(Booking.therapist_id == user.id))
    session.exec(delete(SessionModel).where(SessionModel.patient_id == user.id))
    session.exec(delete(SessionModel).where(SessionModel.therapist_id == user.id))
    session.exec(delete(User).where(User.id == user.id))
    session.commit()
    return Response(status_code=204)
