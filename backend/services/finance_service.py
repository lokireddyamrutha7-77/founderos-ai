from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

from models.finance import FinanceSnapshot


def get_or_create_snapshot(db: Session, user_id: int) -> FinanceSnapshot:
    """Fetch the user's financial snapshot, creating an initial snapshot with zeros if it doesn't exist yet."""
    snapshot = db.query(FinanceSnapshot).filter(FinanceSnapshot.user_id == user_id).first()
    if not snapshot:
        snapshot = FinanceSnapshot(
            user_id=user_id,
            revenue=0.0,
            expenses=0.0,
            burn_rate=0.0,
            runway_months=None,
        )
        db.add(snapshot)
        db.commit()
        db.refresh(snapshot)
    return snapshot


def update_snapshot(db: Session, user_id: int, revenue: float, expenses: float) -> FinanceSnapshot:
    """
    Update revenue and expenses for the user's financial snapshot, recalculating
    burn_rate and runway_months.
    """
    snapshot = get_or_create_snapshot(db, user_id)

    # Calculate burn rate: positive net burn if expenses exceed revenue, else 0
    burn_rate = (expenses - revenue) if (expenses - revenue) > 0 else 0.0

    # Simplified estimate placeholder calculation for runway: revenue / burn_rate.
    # NOTE: This is a simplified estimate for snapshot purposes, not real financial modeling.
    if burn_rate > 0:
        runway_months = round(revenue / burn_rate, 2)
    else:
        runway_months = None

    snapshot.revenue = float(revenue)
    snapshot.expenses = float(expenses)
    snapshot.burn_rate = float(burn_rate)
    snapshot.runway_months = runway_months
    snapshot.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(snapshot)
    return snapshot
