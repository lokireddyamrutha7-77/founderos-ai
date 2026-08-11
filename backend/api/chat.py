from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import SessionLocal
from models.user import User
from schemas.chat import ChatRequest
from services.security import get_current_user

try:
    from services.memory_service import get_memories_for_chat_context
except ImportError:
    from backend.services.memory_service import get_memories_for_chat_context

try:
    from ai.chat_client import (
        ChatGenerationError,
        generate_chat_reply,
    )
except ImportError:
    from backend.ai.chat_client import (
        ChatGenerationError,
        generate_chat_reply,
    )

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("")
@router.post("/")
def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Generate a context-aware Chat response using Memory and Advisor report context.
    """
    try:
        # Fetch up to 5 user memories safely scoped to current_user.id
        memories = get_memories_for_chat_context(
            db=db,
            user_id=current_user.id,
            limit=5,
        )

        memory_context = [
            {
                "title": getattr(m, "title", None) or getattr(m, "category", "Saved memory"),
                "category": getattr(m, "category", ""),
                "content": getattr(m, "content", ""),
            }
            for m in memories
        ]
        used_memory_ids = [m.id for m in memories if hasattr(m, "id")]

        # Advisor report retrieval: Check if advisor_reports model/helper exists
        used_advisor_report_id = None
        advisor_context = None

        try:
            try:
                from models.advisor import AdvisorReport as AdvisorReportModel
            except ImportError:
                from backend.models.advisor import AdvisorReport as AdvisorReportModel

            latest_report = (
                db.query(AdvisorReportModel)
                .filter(AdvisorReportModel.user_id == current_user.id)
                .order_by(AdvisorReportModel.created_at.desc())
                .first()
            )

            if latest_report:
                used_advisor_report_id = getattr(latest_report, "id", None)
                advisor_context = {
                    "idea_score": getattr(latest_report, "idea_score", None),
                    "growth_strategy": getattr(latest_report, "growth_strategy", None),
                    "next_steps": getattr(latest_report, "next_steps", None),
                }
        except Exception:
            used_advisor_report_id = None
            advisor_context = None

        reply = generate_chat_reply(
            message=request.message,
            memories=memory_context,
            advisor_report=advisor_context,
        )

        return {
            "success": True,
            "data": {
                "reply": reply,
                "used_memory_ids": used_memory_ids,
                "used_advisor_report_id": used_advisor_report_id,
            },
            "error": None,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except ChatGenerationError:
        return {
            "success": False,
            "data": None,
            "error": "Chat is temporarily unavailable. Please try again.",
        }
