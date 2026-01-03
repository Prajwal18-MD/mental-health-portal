# backend/src/crud_chat.py
from sqlmodel import select  # type: ignore
from .models import ChatMessage
from datetime import datetime

def save_message(session, user_id: int | None, sender: str, text: str):
    """
    Save a chat message to DB.

    Args:
      session: SQLModel Session
      user_id: int or None (anonymous)
      sender: "user" or "bot"
      text: message text
    """
    msg = ChatMessage(user_id=user_id, sender=sender, text=text)
    session.add(msg)
    session.commit()
    session.refresh(msg)
    return msg

# Backwards-compatible alias expected by some route files
def create_chat_message(session, user_id: int | None, role: str, text: str):
    """
    Backwards-compatible wrapper so routes that call create_chat_message(...)
    continue to work. Maps role -> sender and forwards to save_message.
    """
    # accept both 'role' and 'sender' terminology
    sender = role if role in ("user", "bot") else role
    return save_message(session, user_id=user_id, sender=sender, text=text)

def get_history(session, user_id: int, limit: int = 200):
    """
    Return chat messages for a given user_id (ordered asc).
    """
    stmt = select(ChatMessage).where(ChatMessage.user_id == user_id).order_by(ChatMessage.created_at.asc()).limit(limit)
    return session.exec(stmt).all()
