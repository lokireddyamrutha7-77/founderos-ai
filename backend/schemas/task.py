from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    title: str
    dueDate: Optional[str] = None
    completed: Optional[bool] = False

class TaskResponse(BaseModel):
    id: str
    title: str
    completed: bool
    dueDate: Optional[str] = None

    class Config:
        from_attributes = True
