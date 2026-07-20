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

    class Config:
        from_attributes = True