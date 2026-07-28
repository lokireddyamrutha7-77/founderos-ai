from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class MemoryCreate(BaseModel):
    # Optional for now - once Person 1's auth (get_current_user) is ready,
    # the API layer should stop trusting a client-supplied user_id and
    # instead take it from the authenticated user's JWT token. This field
    # exists now purely so the DB column and response shape are already in
    # place, avoiding a schema migration later.
    user_id: Optional[int] = None
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