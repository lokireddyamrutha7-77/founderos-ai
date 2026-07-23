from datetime import datetime

from pydantic import BaseModel, Field


class MemoryCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1, max_length=50)
    content: str = Field(..., min_length=1)
    importance: int = Field(default=1, ge=1, le=5)
    source: str = "user"
    tags: str = ""


class MemoryResponse(MemoryCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True