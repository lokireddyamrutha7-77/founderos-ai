from datetime import datetime
from sqlalchemy import Column, Float, ForeignKey, Integer, DateTime

from database.db import Base


class FinanceSnapshot(Base):
    __tablename__ = "finance_snapshot"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True, index=True)
    revenue = Column(Float, default=0.0, nullable=False)
    expenses = Column(Float, default=0.0, nullable=False)
    burn_rate = Column(Float, default=0.0, nullable=False)
    runway_months = Column(Float, nullable=True, default=None)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
