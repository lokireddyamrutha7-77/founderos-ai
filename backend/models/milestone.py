from datetime import datetime
from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Text

from database.db import Base


class BusinessMilestone(Base):
    __tablename__ = "business_milestones"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    milestone_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
