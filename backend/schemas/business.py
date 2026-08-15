from pydantic import BaseModel
from typing import Optional, List

class BusinessProfileBase(BaseModel):
    stage: str
    industry: str
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    budget: Optional[str] = None
    location: Optional[str] = None
    availableTime: Optional[str] = None
    onlinePreference: Optional[str] = None
    soloPreference: Optional[str] = None
    investmentCapacity: Optional[float] = None
    currentChallenges: Optional[List[str]] = None
    goals: Optional[List[str]] = None
    revenue: Optional[float] = None
    expenses: Optional[float] = None
    details: Optional[str] = None

class BusinessProfileCreate(BusinessProfileBase):
    pass

class BusinessProfileUpdate(BusinessProfileBase):
    stage: Optional[str] = None
    industry: Optional[str] = None

class BusinessProfileResponse(BusinessProfileBase):
    class Config:
        from_attributes = True
