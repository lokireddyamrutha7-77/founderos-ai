from datetime import datetime
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String

from database.db import Base


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    product_name = Column(String, nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    cost_price = Column(Float, default=0.0, nullable=False)
    selling_price = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
