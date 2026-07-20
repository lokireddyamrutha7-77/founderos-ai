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


# Shared response wrapper - matches the team-wide API contract:
# { "success": bool, "data": ..., "error": str | None }
def success(data):
    return {"success": True, "data": data, "error": None}


# Create Memory
@router.post("/")
def create_memory_route(
    memory: MemoryCreate,
    db: Session = Depends(get_db)
):
    result = create_memory(db, memory)
    return success(MemoryResponse.model_validate(result).model_dump())


# Get All Memories
@router.get("/")
def get_memories_route(
    db: Session = Depends(get_db)
):
    results = get_all_memories(db)
    return success([MemoryResponse.model_validate(r).model_dump() for r in results])


# Search Memories
@router.get("/search")
def search_memories(
    keyword: str = Query(...),
    db: Session = Depends(get_db)
):
    results = (
        db.query(Memory)
        .filter(
            (Memory.title.contains(keyword)) |
            (Memory.content.contains(keyword)) |
            (Memory.tags.contains(keyword))
        )
        .all()
    )
    return success([MemoryResponse.model_validate(r).model_dump() for r in results])


# Important Memories
@router.get("/important")
def important_memories(
    min_importance: int = 3,
    db: Session = Depends(get_db)
):
    results = (
        db.query(Memory)
        .filter(Memory.importance >= min_importance)
        .order_by(Memory.importance.desc())
        .all()
    )
    return success([MemoryResponse.model_validate(r).model_dump() for r in results])


# Timeline
@router.get("/timeline")
def memory_timeline(
    db: Session = Depends(get_db)
):
    results = (
        db.query(Memory)
        .order_by(Memory.created_at.desc())
        .all()
    )
    return success([MemoryResponse.model_validate(r).model_dump() for r in results])


# Category Filter
@router.get("/category/{category}")
def memories_by_category(
    category: str,
    db: Session = Depends(get_db)
):
    results = (
        db.query(Memory)
        .filter(Memory.category == category)
        .all()
    )
    return success([MemoryResponse.model_validate(r).model_dump() for r in results])


@router.get("/retrieve")
def retrieve_memory_context(
    keyword: str = Query(...),
    db: Session = Depends(get_db)
):
    results = retrieve_relevant_memories(db, keyword)
    return success([MemoryResponse.model_validate(r).model_dump() for r in results])