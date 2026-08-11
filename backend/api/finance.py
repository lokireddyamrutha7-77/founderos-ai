from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.db import get_db
from models.user import User
from schemas.finance import FinanceUpdate, FinanceResponse
from services.finance_service import get_or_create_snapshot, update_snapshot
from services.security import get_current_user

router = APIRouter(prefix="/finance", tags=["Finance"])


def success(data):
    return {"success": True, "data": data, "error": None}


@router.get("", include_in_schema=False)
@router.get("/")
def get_finance_snapshot(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    snapshot = get_or_create_snapshot(db, current_user.id)
    return success(FinanceResponse.model_validate(snapshot).model_dump())


@router.put("", include_in_schema=False)
@router.put("/")
def update_finance_snapshot(
    payload: FinanceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    snapshot = update_snapshot(db, current_user.id, payload.revenue, payload.expenses)
    return success(FinanceResponse.model_validate(snapshot).model_dump())
