from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database.db import Base
from datetime import datetime

class AdvisorReport(Base):
    __tablename__ = "advisor_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    title = Column(String)
    assessment_score = Column(Integer)
    explanation = Column(String)
    target_customer = Column(String)
    market_opportunity = Column(String)
    competition = Column(String)
    revenue_model = Column(String)
    pricing = Column(String)
    costs = Column(String)
    swot = Column(JSON)
    roadmap = Column(JSON)
    risks = Column(JSON)
    next_actions = Column(JSON)

    owner = relationship("User")
