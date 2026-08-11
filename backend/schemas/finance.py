from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class FinanceUpdate(BaseModel):
    revenue: float = Field(..., ge=0, description="Monthly revenue amount")
    expenses: float = Field(..., ge=0, description="Monthly expenses amount")


class FinanceResponse(BaseModel):
    id: int
    user_id: int
    revenue: float
    expenses: float
    burn_rate: float
    runway_months: Optional[float] = None
    updated_at: datetime

    class Config:
        from_attributes = True
