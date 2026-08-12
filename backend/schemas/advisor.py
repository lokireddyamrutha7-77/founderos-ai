from datetime import datetime
from typing import List
from pydantic import BaseModel, Field


class AdvisorAnalyzeRequest(BaseModel):
    idea_description: str = Field(
        ...,
        min_length=10,
        max_length=5000
    )


class CompetitorSchema(BaseModel):
    name: str
    weakness: str
    advantage: str


class SWOTAnalysisSchema(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]


class AdvisorReportResponse(BaseModel):
    id: int
    user_id: int
    idea_description: str
    idea_score: int
    market_validation: str
    competitors: List[CompetitorSchema]
    swot: SWOTAnalysisSchema
    business_model: str
    revenue_suggestions: List[str]
    growth_strategy: List[str]
    legal_considerations: str
    next_steps: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

