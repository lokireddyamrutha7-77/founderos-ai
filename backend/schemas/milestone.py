from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class MilestoneCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=250, description="Milestone title")
    description: Optional[str] = Field(None, description="Detailed description of the milestone")
    milestone_date: date = Field(..., description="Target or completion date for the milestone")


class MilestoneResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    milestone_date: date
    created_at: datetime

    class Config:
        from_attributes = True
