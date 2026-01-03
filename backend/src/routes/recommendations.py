# backend/src/routes/recommendations.py
from fastapi import APIRouter, Request, Depends
from sqlmodel import Session # type: ignore
from typing import Dict

from ..database import get_session
from ..ml.recommendations import generate_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.get("")
def get_recommendations(request: Request, session: Session = Depends(get_session)):
    """
    Return prioritized recommendations. Works for anonymous users as well as authenticated users.
    """
    # Default (anonymous) context
    context: Dict = {
        "latest_mood_value": None,
        "latest_risk": None,
        "avg_7_days": None,
        "avg_30_days": None,
    }

    # If you later extract a user id from the token, you can populate context here.
    recs = generate_recommendations(context)
    return {"context": context, "recommendations": recs}
