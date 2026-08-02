from pydantic import BaseModel, ConfigDict, Field


class StrictModel(BaseModel):
    """
    Base model that rejects unexpected fields returned by Gemini.
    """

    model_config = ConfigDict(extra="forbid")


class Competitor(StrictModel):
    """
    Information about one direct, indirect, or substitute competitor.
    """

    name: str = Field(
        description="Name of the competitor or substitute product"
    )

    weakness: str = Field(
        description="A weakness or market gap in the competitor"
    )

    advantage: str = Field(
        description="The startup's advantage over this competitor"
    )


class SWOTAnalysis(StrictModel):
    """
    Structured SWOT analysis containing exactly three points per category.
    """

    strengths: list[str] = Field(
        min_length=3,
        max_length=3,
        description="Exactly three internal strengths"
    )

    weaknesses: list[str] = Field(
        min_length=3,
        max_length=3,
        description="Exactly three internal weaknesses"
    )

    opportunities: list[str] = Field(
        min_length=3,
        max_length=3,
        description="Exactly three external opportunities"
    )

    threats: list[str] = Field(
        min_length=3,
        max_length=3,
        description="Exactly three external threats"
    )


class AdvisorReport(StrictModel):
    """
    Complete eight-field response returned by the FounderOS Advisor.
    """

    idea_score: int = Field(
        ge=0,
        le=100,
        description="Overall startup viability score from 0 to 100"
    )

    market_validation: str = Field(
        description=(
            "Analysis of the target customer, market demand, "
            "validation signals, assumptions, and market risks"
        )
    )

    competitors: list[Competitor] = Field(
        min_length=3,
        max_length=3,
        description="Exactly three competitors or substitute solutions"
    )

    swot: SWOTAnalysis = Field(
        description="Structured strengths, weaknesses, opportunities, and threats"
    )

    business_model: str = Field(
        description=(
            "Recommended business model, pricing method, "
            "major costs, and unit-economics assumptions"
        )
    )

    revenue_suggestions: list[str] = Field(
        min_length=3,
        max_length=3,
        description="Exactly three realistic revenue opportunities"
    )

    growth_strategy: list[str] = Field(
        min_length=3,
        max_length=3,
        description="Exactly three growth stages covering days 1-30, 31-60, and 61-90"
    )

    next_steps: list[str] = Field(
        min_length=5,
        max_length=5,
        description="Exactly five immediate actions in priority order"
    )