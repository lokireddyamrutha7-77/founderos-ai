from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from database.db import Base


class Memory(Base):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)
    # Nullable for now - Person 1's auth/users table isn't ready yet.
    # Once it lands, every write path should start passing the real user_id,
    # and a future step can make this non-nullable + backfill old rows.
    user_id = Column(Integer, nullable=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    importance = Column(Integer, default=1)
    source = Column(String, default="user")
    tags = Column(String)