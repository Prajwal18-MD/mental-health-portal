from sqlmodel import select
from .models import User
from .database import engine, get_session

def get_user_by_email(session, email: str):
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

def get_user_by_id(session, user_id: int):
    statement = select(User).where(User.id == user_id)
    return session.exec(statement).first()

def create_user(session, name: str, email: str, hashed_password: str, role: str = "patient"):
    user = User(name=name, email=email, hashed_password=hashed_password, role=role)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
