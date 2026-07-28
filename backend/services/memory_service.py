from sqlalchemy.orm import Session

from models.memory import Memory
from schemas.memory import MemoryCreate


def create_memory(db: Session, memory: MemoryCreate):
    new_memory = Memory(
        title=memory.title,
        category=memory.category,
        content=memory.content,
        importance=memory.importance,
        source=memory.source,
        tags=memory.tags,
    )

    db.add(new_memory)
    db.commit()
    db.refresh(new_memory)

    return new_memory


def get_all_memories(db: Session, skip: int = 0, limit: int = 50):
    return (
        db.query(Memory)
        .order_by(Memory.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def count_all_memories(db: Session):
    return db.query(Memory).count()


def get_category_counts(db: Session):
    from sqlalchemy import func as sql_func
    rows = (
        db.query(Memory.category, sql_func.count(Memory.id))
        .group_by(Memory.category)
        .all()
    )
    return {category: count for category, count in rows}


def get_memory_by_id(db: Session, memory_id: int):
    return db.query(Memory).filter(Memory.id == memory_id).first()


def update_memory(db: Session, memory_id: int, memory: MemoryCreate):
    existing = get_memory_by_id(db, memory_id)
    if not existing:
        return None

    existing.title = memory.title
    existing.category = memory.category
    existing.content = memory.content
    existing.importance = memory.importance
    existing.source = memory.source
    existing.tags = memory.tags

    db.commit()
    db.refresh(existing)
    return existing


def delete_memory(db: Session, memory_id: int):
    existing = get_memory_by_id(db, memory_id)
    if not existing:
        return False

    db.delete(existing)
    db.commit()
    return True


def retrieve_relevant_memories(db: Session, keyword: str):
    return (
        db.query(Memory)
        .filter(
            (Memory.title.contains(keyword)) |
            (Memory.content.contains(keyword)) |
            (Memory.tags.contains(keyword))
        )
        .order_by(Memory.importance.desc())
        .all()
    )