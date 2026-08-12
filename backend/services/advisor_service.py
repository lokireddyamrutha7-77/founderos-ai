from typing import Optional
from sqlalchemy.orm import Session

from models.advisor import AdvisorReport


def save_report(
    db: Session,
    user_id: int,
    idea_description: str,
    report_data: dict,
) -> AdvisorReport:
    """
    Save a new AdvisorReport for the specified user.
    """
    db_report = AdvisorReport(
        user_id=user_id,
        idea_description=idea_description,
        idea_score=report_data["idea_score"],
        market_validation=report_data["market_validation"],
        competitors=report_data["competitors"],
        swot=report_data["swot"],
        business_model=report_data["business_model"],
        revenue_suggestions=report_data["revenue_suggestions"],
        growth_strategy=report_data["growth_strategy"],
        legal_considerations=report_data["legal_considerations"],
        next_steps=report_data["next_steps"],
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


def get_latest_report_by_user(
    db: Session,
    user_id: int,
) -> Optional[AdvisorReport]:
    """
    Retrieve the most recent AdvisorReport for the specified user.
    """
    return (
        db.query(AdvisorReport)
        .filter(AdvisorReport.user_id == user_id)
        .order_by(AdvisorReport.created_at.desc(), AdvisorReport.id.desc())
        .first()
    )
