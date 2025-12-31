from fastapi import FastAPI
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables
from .routes import auth, mood, bookings, sessions, therapist, chat

app = FastAPI(title="Mental Health Portal API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
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
