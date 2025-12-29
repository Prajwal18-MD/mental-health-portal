from fastapi import FastAPI
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mental Health Portal API")

# Allow Vite dev server to call the API
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # add more origins if needed in future
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Backend is running successfully",
        "time": datetime.now().isoformat()
    }
