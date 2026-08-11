from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.db import get_db
from models.user import User
from schemas.milestone import MilestoneCreate, MilestoneResponse
from services.milestone_service import create_milestone, get_milestones_by_user
from services.security import get_current_user

router = APIRouter(prefix="/milestones", tags=["Milestones"])


def success(data):
    return {"success": True, "data": data, "error": None}


@router.post("", include_in_schema=False)
@router.post("/")
def create_milestone_route(
    milestone: MilestoneCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = create_milestone(db, current_user.id, milestone)
    return success(MilestoneResponse.model_validate(result).model_dump())


@router.get("", include_in_schema=False)
@router.get("/")
def get_milestones_route(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = get_milestones_by_user(db, current_user.id)
    return success([MilestoneResponse.model_validate(r).model_dump() for r in results])
