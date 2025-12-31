# backend/src/routes/recommendations.py
from fastapi import APIRouter, Depends
from sqlmodel import Session
from ..database import get_session
from ..routes.auth import get_current_user
from ..crud_mood import list_moods_for_user, avg_mood_for_user
from ..ml.recommendations import generate_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])

@router.get("")
def get_recommendations(current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    moods = list_moods_for_user(session, current_user.id, limit=1)
    latest = moods[0] if moods else None
    latest_val = latest.mood_value if latest else None
    latest_risk = latest.risk if latest else None
    avg7 = avg_mood_for_user(session, current_user.id, days=7)
    avg30 = avg_mood_for_user(session, current_user.id, days=30)

    context = {
        "latest_mood_value": latest_val,
        "latest_risk": latest_risk,
        "avg_7_days": avg7,
        "avg_30_days": avg30
    }

    recs = generate_recommendations(context)
    return {"context": context, "recommendations": recs}
