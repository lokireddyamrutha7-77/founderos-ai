from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from database.db import Base


class Memory(Base):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    importance = Column(Integer, default=1)
    source = Column(String, default="user")
    tags = Column(String)