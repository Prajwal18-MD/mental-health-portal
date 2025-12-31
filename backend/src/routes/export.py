# backend/src/routes/export.py
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select
from ..database import get_session
from ..routes.auth import get_current_user
from ..models import Mood, ChatMessage
import csv
import io

router = APIRouter(prefix="/api/export", tags=["export"])

@router.get("/csv")
def export_csv(current_user = Depends(get_current_user), session: Session = Depends(get_session)):
    def gen():
        buf = io.StringIO()
        writer = csv.writer(buf)
        # moods header
        writer.writerow(["type","id","date","mood_value","risk","text"])
        yield buf.getvalue(); buf.seek(0); buf.truncate(0)

        stmt = select(Mood).where(Mood.user_id == current_user.id).order_by(Mood.date.asc())
        for m in session.exec(stmt).all():
            writer.writerow(["mood", m.id, m.date.isoformat(), m.mood_value, m.risk or "", (m.text or "").replace("\n"," ")])
            yield buf.getvalue(); buf.seek(0); buf.truncate(0)

        # chats
        writer.writerow(["type","id","date","sender","text"])
        yield buf.getvalue(); buf.seek(0); buf.truncate(0)

        stmt2 = select(ChatMessage).where(ChatMessage.user_id == current_user.id).order_by(ChatMessage.created_at.asc())
        for c in session.exec(stmt2).all():
            writer.writerow(["chat", c.id, c.created_at.isoformat(), c.sender, (c.text or "").replace("\n"," ")])
            yield buf.getvalue(); buf.seek(0); buf.truncate(0)

    headers = {"Content-Disposition": f"attachment; filename=mh_export_{current_user.id}.csv"}
    return StreamingResponse(gen(), media_type="text/csv", headers=headers)
