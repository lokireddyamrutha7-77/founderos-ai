from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database.db import Base

class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    stage = Column(String)
    industry = Column(String)
    interests = Column(JSON)
    skills = Column(JSON)
    budget = Column(String)
    location = Column(String)
    available_time = Column(String)
    online_preference = Column(String)
    solo_preference = Column(String)
    investment_capacity = Column(Float)
    current_challenges = Column(JSON)
    goals = Column(JSON)
    revenue = Column(Float)
    expenses = Column(Float)
    details = Column(String)

    owner = relationship("User")
