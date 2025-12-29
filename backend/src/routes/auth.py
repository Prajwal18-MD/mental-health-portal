from fastapi import APIRouter, Depends, HTTPException, status, Header
from pydantic import BaseModel, EmailStr
from sqlmodel import Session
from typing import Optional
from ..database import get_session
from ..crud import get_user_by_email, create_user, get_user_by_id
from ..auth_utils import get_password_hash, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "patient"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/register")
def register(data: RegisterRequest, session: Session = Depends(get_session)):
    existing = get_user_by_email(session, data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = get_password_hash(data.password)
    user = create_user(session, data.name, data.email, hashed, data.role)
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, session: Session = Depends(get_session)):
    user = get_user_by_email(session, data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=str(user.id))
    return {"access_token": token}

def get_current_user(authorization: Optional[str] = Header(None), session: Session = Depends(get_session)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")
    token = authorization.split(" ")[1]
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.get("/me")
def me(current_user = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "role": current_user.role}
