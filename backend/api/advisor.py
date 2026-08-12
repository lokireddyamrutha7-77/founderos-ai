from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import SessionLocal
from models.user import User
from schemas.advisor import AdvisorAnalyzeRequest, AdvisorReportResponse
from services.advisor_service import get_latest_report_by_user, save_report
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

        saved_report = save_report(
            db=db,
            user_id=current_user.id,
            idea_description=request.idea_description,
            report_data=report,
        )

        response_data = AdvisorReportResponse.model_validate(
            saved_report
        ).model_dump(mode="json")

        return {
            "success": True,
            "data": response_data,
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


@router.get("/latest")
def get_latest_advisor(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = get_latest_report_by_user(db, current_user.id)
    if not report:
        return {
            "success": True,
            "data": None,
            "error": None,
        }

    response_data = AdvisorReportResponse.model_validate(
        report
    ).model_dump(mode="json")

    return {
        "success": True,
        "data": response_data,
        "error": None,
    }

