from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, Text

from database.db import Base


class AdvisorReport(Base):
    __tablename__ = "advisor_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    idea_description = Column(Text, nullable=False)
    idea_score = Column(Integer, nullable=False)
    market_validation = Column(Text, nullable=False)
    competitors = Column(JSON, nullable=False)
    swot = Column(JSON, nullable=False)
    business_model = Column(Text, nullable=False)
    revenue_suggestions = Column(JSON, nullable=False)
    growth_strategy = Column(JSON, nullable=False)
    legal_considerations = Column(Text, nullable=False)
    next_steps = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
