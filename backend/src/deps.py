# backend/src/deps.py
from fastapi import HTTPException, status, Depends
from .routes.auth import get_current_user

def require_role(role: str):
    def _require(current_user = Depends(get_current_user)):
        if not current_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
        if current_user.role != role:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
        return current_user
    return _require
