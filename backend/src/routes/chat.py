# backend/src/routes/chat.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlmodel import Session
from ..database import get_session
from ..routes.auth import get_current_user
from ..crud_chat import save_message, get_history
from ..ml.retrieval import get_best_response
from ..ml.sentiment import analyze_text
from ..ml.risk import detect_risk

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatIn(BaseModel):
    message: str
    context: Optional[str] = None

class ChatOut(BaseModel):
    reply: str
    escalate: bool = False
    reason: Optional[str] = None
    response_id: Optional[str] = None

@router.post("", response_model=ChatOut)
def post_chat(payload: ChatIn, current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    # Save user's message
    user_id = current_user.id
    save_message(session, user_id=user_id, sender="user", text=payload.message)

    # Analyze sentiment & risk
    scores = analyze_text(payload.message or "")
    compound = float(scores.get("compound", 0.0))
    risk_level, explanation = detect_risk(payload.message or "", compound, None)

    # If HIGH risk -> immediate escalation reply
    if risk_level == "HIGH":
        reply = ("I'm really sorry you're feeling that way. Your message shows signs of serious distress. "
                 "I can't provide emergency services, but I recommend contacting a professional right now or calling emergency services. "
                 "Would you like me to show available therapists and let you book a session immediately?")
        # Save bot message
        save_message(session, user_id=user_id, sender="bot", text=reply)
        return {"reply": reply, "escalate": True, "reason": explanation, "response_id": "escalation_high"}

    # Otherwise use retrieval-based reply
    bot_text, resp_id, score = get_best_response(payload.message)
    # If similarity low, use empathetic fallback
    if score < 0.15:
        bot_text = "I hear you. Can you say a bit more about how that made you feel? I’m listening."
        resp_id = "fallback_emp"
    # Save bot reply
    save_message(session, user_id=user_id, sender="bot", text=bot_text)
    return {"reply": bot_text, "escalate": False, "reason": f"compound {compound}", "response_id": resp_id}

@router.get("/history")
def chat_history(current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    rows = get_history(session, user_id=current_user.id, limit=500)
    # convert to simple dicts
    return [{"id": r.id, "sender": r.sender, "text": r.text, "created_at": r.created_at.isoformat()} for r in rows]
