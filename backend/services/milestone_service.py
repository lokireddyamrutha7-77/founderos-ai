from typing import List
from sqlalchemy.orm import Session

from models.milestone import BusinessMilestone
from schemas.milestone import MilestoneCreate


def create_milestone(db: Session, user_id: int, milestone: MilestoneCreate) -> BusinessMilestone:
    """Create a new business milestone for the given user."""
    db_milestone = BusinessMilestone(
        user_id=user_id,
        title=milestone.title,
        description=milestone.description,
        milestone_date=milestone.milestone_date,
    )
    db.add(db_milestone)
    db.commit()
    db.refresh(db_milestone)
    return db_milestone


def get_milestones_by_user(db: Session, user_id: int) -> List[BusinessMilestone]:
    """Retrieve all business milestones for the user, ordered by milestone_date ascending."""
    return (
        db.query(BusinessMilestone)
        .filter(BusinessMilestone.user_id == user_id)
        .order_by(BusinessMilestone.milestone_date.asc())
        .all()
    )
