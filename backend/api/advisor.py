from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import SessionLocal
from models.user import User
from schemas.advisor import AdvisorAnalyzeRequest
from services.security import get_current_user

try:
    from ai.gemini_client import (
        AdvisorGenerationError,
        analyze_startup_idea,
    )
except ImportError:
    from backend.ai.gemini_client import (
        AdvisorGenerationError,
        analyze_startup_idea,
    )

router = APIRouter(
    prefix="/advisor",
    tags=["Advisor"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/analyze")
def analyze_advisor(
    request: AdvisorAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        report = analyze_startup_idea(
            request.idea_description
        )

        return {
            "success": True,
            "data": report,
            "error": None,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except AdvisorGenerationError:
        raise HTTPException(
            status_code=503,
            detail="Advisor generation is temporarily unavailable. Please try again.",
        )
