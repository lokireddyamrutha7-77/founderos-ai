from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import Base, engine
import database.base
from models.user import User
from api.auth import router as auth_router

app = FastAPI(
    title="Altora API",
    version="1.0.0"
)

# Allow frontend (React/Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# Create all database tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {
        "success": True,
        "data": {
            "message": "Altora Backend Running"
        },
        "error": None
    }