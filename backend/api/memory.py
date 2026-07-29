from fastapi import APIRouter, Depends, HTTPException, Query
from services.memory_service import (
    count_all_memories,
    create_memory,
    delete_memory,
    get_all_memories,
    get_category_counts,
    get_memories_by_user,
    get_memory_by_id,
    retrieve_relevant_memories,
    update_memory,
)
from sqlalchemy import func
from sqlalchemy.orm import Session

from database.db import SessionLocal
from models.memory import Memory
from models.user import User
from schemas.memory import MemoryCreate, MemoryResponse
from services.security import get_current_user

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

# Create Memory - now scoped to the logged-in user
@router.post("/")
def create_memory_route(
    memory: MemoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    memory.user_id = current_user.id
    result = create_memory(db, memory)
    return success(MemoryResponse.model_validate(result).model_dump())


# Get All Memories (paginated - newest first - scoped to the logged-in user)
@router.get("/")
def get_memories_route(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = get_memories_by_user(db, current_user.id, skip=skip, limit=limit)
    total = (
        db.query(Memory)
        .filter(Memory.user_id == current_user.id)
        .count()
    )
    return success({
        "items": [MemoryResponse.model_validate(r).model_dump() for r in results],
        "total": total,
        "skip": skip,
        "limit": limit,
    })


# Stats - scoped to the logged-in user
@router.get("/stats")
def memory_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total = db.query(Memory).filter(Memory.user_id == current_user.id).count()
    rows = (
        db.query(Memory.category, func.count(Memory.id))
        .filter(Memory.user_id == current_user.id)
        .group_by(Memory.category)
        .all()
    )
    return success({
        "total": total,
        "by_category": {category: count for category, count in rows},
    })


# Search Memories - scoped to the logged-in user
@router.get("/search")
def search_memories(
    keyword: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = (
        db.query(Memory)
        .filter(Memory.user_id == current_user.id)
        .filter(
            (Memory.title.contains(keyword)) |
            (Memory.content.contains(keyword)) |
            (Memory.tags.contains(keyword))
        )
        .all()
    )
    return success([MemoryResponse.model_validate(r).model_dump() for r in results])


# Important Memories - scoped to the logged-in user
@router.get("/important")
def important_memories(
    min_importance: int = 3,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = (
        db.query(Memory)
        .filter(Memory.user_id == current_user.id)
        .filter(Memory.importance >= min_importance)
        .order_by(Memory.importance.desc())
        .all()
    )
    return success([MemoryResponse.model_validate(r).model_dump() for r in results])


# Timeline - scoped to the logged-in user
@router.get("/timeline")
def memory_timeline(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = (
        db.query(Memory)
        .filter(Memory.user_id == current_user.id)
        .order_by(Memory.created_at.desc())
        .all()
    )
    return success([MemoryResponse.model_validate(r).model_dump() for r in results])


# Category Filter - scoped to the logged-in user
@router.get("/category/{category}")
def memories_by_category(
    category: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = (
        db.query(Memory)
        .filter(Memory.user_id == current_user.id)
        .filter(func.lower(Memory.category) == category.lower())
        .all()
    )
    return success([MemoryResponse.model_validate(r).model_dump() for r in results])


# Used internally by Chat - scoped to the logged-in user
@router.get("/retrieve")
def retrieve_memory_context(
    keyword: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = (
        db.query(Memory)
        .filter(Memory.user_id == current_user.id)
        .filter(
            (Memory.title.contains(keyword)) |
            (Memory.content.contains(keyword)) |
            (Memory.tags.contains(keyword))
        )
        .order_by(Memory.importance.desc())
        .all()
    )
    return success([MemoryResponse.model_validate(r).model_dump() for r in results])


# ---------------------------------------------------------------------
# Dynamic /{memory_id} routes - must stay BELOW all fixed-string routes above.
# ---------------------------------------------------------------------

# Get a single memory by ID - only if it belongs to the logged-in user
@router.get("/{memory_id}")
def get_memory_route(
    memory_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = get_memory_by_id(db, memory_id)
    if not result or result.user_id != current_user.id:
        raise HTTPException(status_code=404, detail=f"Memory with id {memory_id} not found")
    return success(MemoryResponse.model_validate(result).model_dump())


# Update a memory - only if it belongs to the logged-in user
@router.put("/{memory_id}")
def update_memory_route(
    memory_id: int,
    memory: MemoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = get_memory_by_id(db, memory_id)
    if not existing or existing.user_id != current_user.id:
        raise HTTPException(status_code=404, detail=f"Memory with id {memory_id} not found")

    memory.user_id = current_user.id
    result = update_memory(db, memory_id, memory)
    return success(MemoryResponse.model_validate(result).model_dump())


# Delete a memory - only if it belongs to the logged-in user
@router.delete("/{memory_id}")
def delete_memory_route(
    memory_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = get_memory_by_id(db, memory_id)
    if not existing or existing.user_id != current_user.id:
        raise HTTPException(status_code=404, detail=f"Memory with id {memory_id} not found")

    delete_memory(db, memory_id)
    return success({"deleted_id": memory_id})