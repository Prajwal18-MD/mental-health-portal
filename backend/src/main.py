from fastapi import FastAPI
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables
from .routes import auth, mood, bookings, sessions, therapist, chat, recommendations, analytics, export, account, audit
from .routes.bookings_auto import router as bookings_auto_router

app = FastAPI(title="Mental Health Portal API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",   # optional dev ports you may use
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(mood.router)
app.include_router(bookings.router)
app.include_router(sessions.router)
app.include_router(therapist.router)
app.include_router(chat.router)
app.include_router(recommendations.router)
app.include_router(analytics.router)
app.include_router(export.router)
app.include_router(account.router)
app.include_router(audit.router)
app.include_router(bookings_auto_router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Backend is running successfully",
        "time": datetime.now().isoformat()
    }
