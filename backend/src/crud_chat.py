# backend/src/crud_chat.py
from sqlmodel import select
from .models import ChatMessage
from datetime import datetime

def save_message(session, user_id: int, sender: str, text: str):
    msg = ChatMessage(user_id=user_id, sender=sender, text=text)
    session.add(msg)
    session.commit()
    session.refresh(msg)
    return msg

def get_history(session, user_id: int, limit: int = 200):
    stmt = select(ChatMessage).where(ChatMessage.user_id == user_id).order_by(ChatMessage.created_at.asc()).limit(limit)
    return session.exec(stmt).all()
