from fastapi import APIRouter, Depends, HTTPException, Query
from services.memory_service import (
    count_all_memories,
    create_memory,
    delete_memory,
    get_all_memories,
    get_category_counts,
    get_memory_by_id,
    retrieve_relevant_memories,
    update_memory,
)
from sqlalchemy import func
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


# ---------------------------------------------------------------------
# IMPORTANT: fixed-string routes (search, timeline, important, category,
# retrieve) must all be declared BEFORE the dynamic /{memory_id} routes
# further down. FastAPI matches routes top-to-bottom, so if /{memory_id}
# were declared first, a request to /memory/timeline would incorrectly
# match it (trying to convert "timeline" to an int and failing with a
# 422 error) instead of reaching the real /timeline route.
# ---------------------------------------------------------------------

# Create Memory
@router.post("/")
def create_memory_route(
    memory: MemoryCreate,
    db: Session = Depends(get_db)
):
    result = create_memory(db, memory)
    return success(MemoryResponse.model_validate(result).model_dump())


# Get All Memories (paginated - newest first)
@router.get("/")
def get_memories_route(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    results = get_all_memories(db, skip=skip, limit=limit)
    total = count_all_memories(db)
    return success({
        "items": [MemoryResponse.model_validate(r).model_dump() for r in results],
        "total": total,
        "skip": skip,
        "limit": limit,
    })


# Stats - total count and count per category, useful for a Dashboard widget
@router.get("/stats")
def memory_stats(
    db: Session = Depends(get_db)
):
    return success({
        "total": count_all_memories(db),
        "by_category": get_category_counts(db),
    })


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
        .filter(func.lower(Memory.category) == category.lower())
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


# ---------------------------------------------------------------------
# Dynamic /{memory_id} routes - must stay BELOW all fixed-string routes above.
# ---------------------------------------------------------------------

# Get a single memory by ID
@router.get("/{memory_id}")
def get_memory_route(
    memory_id: int,
    db: Session = Depends(get_db)
):
    result = get_memory_by_id(db, memory_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"Memory with id {memory_id} not found")
    return success(MemoryResponse.model_validate(result).model_dump())


# Update a memory
@router.put("/{memory_id}")
def update_memory_route(
    memory_id: int,
    memory: MemoryCreate,
    db: Session = Depends(get_db)
):
    result = update_memory(db, memory_id, memory)
    if not result:
        raise HTTPException(status_code=404, detail=f"Memory with id {memory_id} not found")
    return success(MemoryResponse.model_validate(result).model_dump())


# Delete a memory
@router.delete("/{memory_id}")
def delete_memory_route(
    memory_id: int,
    db: Session = Depends(get_db)
):
    deleted = delete_memory(db, memory_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Memory with id {memory_id} not found")
    return success({"deleted_id": memory_id})