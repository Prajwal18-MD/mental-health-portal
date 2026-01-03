# backend/src/routes/chat.py
from fastapi import APIRouter, Request, Depends
from pydantic import BaseModel
from typing import Optional
from sqlmodel import Session # type: ignore

from ..database import get_session
from ..crud_chat import create_chat_message
from ..ml.retrieval import get_best_response

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatIn(BaseModel):
    # accept either "message" or "text" from the frontend
    message: Optional[str] = None
    text: Optional[str] = None
    context: Optional[str] = None

@router.post("")
def post_chat(payload: ChatIn, request: Request, session: Session = Depends(get_session)):
    """
    Accept chat messages from authenticated or anonymous users.
    Payload accepts either {"message": "..."} or {"text": "..."} for compatibility.
    """
    # pick whichever is present
    incoming = (payload.message or payload.text or "").strip()
    if not incoming:
        # return a 400-like response for empty payload
        return {"reply": "Please send a non-empty message.", "response_id": "empty_input"}

    user_id = None  # anonymous by default; you can populate from token if you wire it later

    # save user's message (non-fatal)
    try:
        create_chat_message(session, user_id=user_id, role="user", text=incoming)
    except Exception:
        pass

    # generate canned reply
    reply_text, response_id, score = get_best_response(incoming or "")

    if score < 0.05:
        reply_text = "I hear you. Can you say a little more about how that felt?"
        response_id = "fallback_emp"

    # Save bot reply (non-fatal)
    try:
        create_chat_message(session, user_id=user_id, role="bot", text=reply_text)
    except Exception:
        pass

    return {"reply": reply_text, "response_id": response_id}
