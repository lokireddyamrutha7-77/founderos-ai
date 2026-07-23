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


def get_all_memories(db: Session):
    return db.query(Memory).all()

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