from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.user import User
from models.business import BusinessProfile as BusinessProfileModel
from schemas.business import BusinessProfileCreate, BusinessProfileUpdate, BusinessProfileResponse
from services.security import get_current_user
import json

router = APIRouter(prefix="/business", tags=["Business"])

def success(data):
    return {"success": True, "data": data, "error": None}

def to_camel(snake_str):
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

def profile_to_dict(profile):
    d = {}
    for column in profile.__table__.columns:
        if column.name in ['id', 'user_id']: continue
        camel_key = to_camel(column.name)
        d[camel_key] = getattr(profile, column.name)
    return d

@router.get("/")
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(BusinessProfileModel).filter(BusinessProfileModel.user_id == current_user.id).first()
    if not profile:
        return success(None)
    return success(profile_to_dict(profile))

@router.post("/")
def save_profile(profile: BusinessProfileCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_profile = db.query(BusinessProfileModel).filter(BusinessProfileModel.user_id == current_user.id).first()
    if not db_profile:
        db_profile = BusinessProfileModel(user_id=current_user.id)
        db.add(db_profile)

    db_profile.stage = profile.stage
    db_profile.industry = profile.industry
    db_profile.interests = profile.interests
    db_profile.skills = profile.skills
    db_profile.budget = profile.budget
    db_profile.location = profile.location
    db_profile.available_time = profile.availableTime
    db_profile.online_preference = profile.onlinePreference
    db_profile.solo_preference = profile.soloPreference
    db_profile.investment_capacity = profile.investmentCapacity
    db_profile.current_challenges = profile.currentChallenges
    db_profile.goals = profile.goals
    db_profile.revenue = profile.revenue
    db_profile.expenses = profile.expenses
    db_profile.details = profile.details

    # We do not set has_onboarded on User here directly as the frontend relies on User data.
    # Let's keep it simple.

    db.commit()
    db.refresh(db_profile)
    return success(profile_to_dict(db_profile))

@router.put("/")
def update_profile(profile: BusinessProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_profile = db.query(BusinessProfileModel).filter(BusinessProfileModel.user_id == current_user.id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_data = profile.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        import re
        snake_key = re.sub(r'(?<!^)(?=[A-Z])', '_', key).lower()
        setattr(db_profile, snake_key, value)

    db.commit()
    db.refresh(db_profile)
    return success(profile_to_dict(db_profile))
