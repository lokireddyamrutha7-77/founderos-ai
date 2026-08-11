from pydantic import BaseModel, Field


class AdvisorAnalyzeRequest(BaseModel):
    idea_description: str = Field(
        ...,
        min_length=10,
        max_length=5000
    )
