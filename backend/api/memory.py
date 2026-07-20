from fastapi import APIRouter, Depends, Query
from services.memory_service import (
    create_memory,
    get_all_memories,
    retrieve_relevant_memories,
)
from sqlalchemy.orm import Session

from database.db import SessionLocal
from models.memory import Memory
from schemas.memory import MemoryCreate, MemoryResponse

router = APIRouter(prefix="/memory", tags=["Memory"])


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create Memory
@router.post("/", response_model=MemoryResponse)
def create_memory_route(
    memory: MemoryCreate,
    db: Session = Depends(get_db)
):
    return create_memory(db, memory)


# Get All Memories
@router.get("/", response_model=list[MemoryResponse])
def get_memories_route(
    db: Session = Depends(get_db)
):
    return get_all_memories(db)


# Search Memories
@router.get("/search", response_model=list[MemoryResponse])
def search_memories(
    keyword: str = Query(...),
    db: Session = Depends(get_db)
):
    return (
        db.query(Memory)
        .filter(
            (Memory.title.contains(keyword)) |
            (Memory.content.contains(keyword)) |
            (Memory.tags.contains(keyword))
        )
        .all()
    )


# Important Memories
@router.get("/important", response_model=list[MemoryResponse])
def important_memories(
    min_importance: int = 3,
    db: Session = Depends(get_db)
):
    return (
        db.query(Memory)
        .filter(Memory.importance >= min_importance)
        .order_by(Memory.importance.desc())
        .all()
    )


# Timeline
@router.get("/timeline", response_model=list[MemoryResponse])
def memory_timeline(
    db: Session = Depends(get_db)
):
    return (
        db.query(Memory)
        .order_by(Memory.created_at.desc())
        .all()
    )


# Category Filter
@router.get("/category/{category}", response_model=list[MemoryResponse])
def memories_by_category(
    category: str,
    db: Session = Depends(get_db)
):
    return (
        db.query(Memory)
        .filter(Memory.category == category)
        .all()
    )

@router.get("/retrieve", response_model=list[MemoryResponse])
def retrieve_memory_context(
    keyword: str = Query(...),
    db: Session = Depends(get_db)
):
    return retrieve_relevant_memories(db, keyword)