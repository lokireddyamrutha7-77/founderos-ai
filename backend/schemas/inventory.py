from datetime import datetime
from pydantic import BaseModel, Field


class InventoryCreate(BaseModel):
    product_name: str = Field(..., min_length=1, max_length=200, description="Name of the product")
    quantity: int = Field(default=0, ge=0, description="Available stock quantity")
    cost_price: float = Field(default=0.0, ge=0, description="Cost price per unit")
    selling_price: float = Field(default=0.0, ge=0, description="Selling price per unit")


class InventoryResponse(BaseModel):
    id: int
    user_id: int
    product_name: str
    quantity: int
    cost_price: float
    selling_price: float
    created_at: datetime

    class Config:
        from_attributes = True
