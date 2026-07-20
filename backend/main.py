from fastapi import FastAPI

from database.db import Base, engine
from models.memory import Memory
from api.memory import router as memory_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FounderOS AI API")


app.include_router(memory_router)


@app.get("/")
def home():
    return {
        "message": "FounderOS AI Backend is Running 🚀"
    }