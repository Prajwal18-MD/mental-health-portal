# backend/src/routes/analytics.py
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select # type: ignore
from datetime import datetime, timedelta
from ..database import get_session
from ..routes.auth import get_current_user
from ..models import Mood

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/chart-data")
def chart_data(days: int = Query(7, ge=1, le=365, alias="range"), current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Returns daily buckets for the past `days` days (alias 'range' in query string).
    Example: /api/analytics/chart-data?range=7
    """
    end = datetime.utcnow()
    start = end - timedelta(days=days-1)

    # initialize buckets (avg default 0.0)
    day_map = {}
    for i in range(days):
        d = (start + timedelta(days=i)).date()
        day_map[d.isoformat()] = {"date": d.isoformat(), "sum": 0.0, "count": 0, "avg": 0.0, "high": 0, "medium": 0, "low": 0}

    statement = select(Mood).where(Mood.user_id == current_user.id).where(Mood.date >= start).where(Mood.date <= end)
    rows = session.exec(statement).all()
    for r in rows:
        d = r.date.date().isoformat()
        if d not in day_map:
            # ignore out-of-range entries
            continue
        day_map[d]["sum"] += float(r.mood_value)
        day_map[d]["count"] += 1
        if r.risk == "HIGH":
            day_map[d]["high"] += 1
        elif r.risk == "MEDIUM":
            day_map[d]["medium"] += 1
        else:
            day_map[d]["low"] += 1

    out = []
    for key in sorted(day_map.keys()):
        rec = day_map[key]
        rec["avg"] = round(rec["sum"]/rec["count"], 2) if rec["count"] > 0 else 0.0
        out.append(rec)
    return out
