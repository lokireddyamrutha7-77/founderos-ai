from datetime import datetime

from pydantic import BaseModel


class MemoryCreate(BaseModel):
    title: str
    category: str
    content: str
    importance: int = 1
    source: str = "user"
    tags: str


class MemoryResponse(MemoryCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True