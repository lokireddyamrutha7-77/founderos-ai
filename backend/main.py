from fastapi import FastAPI

from database.db import Base, engine
import database.base
from models.user import User
from api.auth import router as auth_router

app = FastAPI(
    title="Altora API",
    version="1.0.0"
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