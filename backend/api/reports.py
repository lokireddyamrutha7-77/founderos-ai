from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from database.db import get_db
from models.advisor import AdvisorReport
from models.user import User
from services.finance_service import get_or_create_snapshot
from services.pdf_service import generate_advisor_report_pdf, generate_finance_snapshot_pdf
from services.security import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/advisor/{report_id}/pdf")
def get_advisor_report_pdf_route(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(AdvisorReport)
        .filter(AdvisorReport.id == report_id, AdvisorReport.user_id == current_user.id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Advisor report with id {report_id} not found",
        )

    pdf_bytes = generate_advisor_report_pdf(report)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="advisor-report.pdf"'},
    )


@router.get("/finance/pdf")
def get_finance_snapshot_pdf_route(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    snapshot = get_or_create_snapshot(db, current_user.id)
    pdf_bytes = generate_finance_snapshot_pdf(snapshot)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="finance-snapshot.pdf"'},
    )
