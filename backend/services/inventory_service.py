from typing import List, Optional
from sqlalchemy.orm import Session

from models.inventory import InventoryItem
from schemas.inventory import InventoryCreate

LOW_STOCK_THRESHOLD = 5


def create_item(db: Session, user_id: int, item: InventoryCreate) -> InventoryItem:
    """Create a new inventory item for the user."""
    db_item = InventoryItem(
        user_id=user_id,
        product_name=item.product_name,
        quantity=item.quantity,
        cost_price=item.cost_price,
        selling_price=item.selling_price,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_items_by_user(db: Session, user_id: int) -> List[InventoryItem]:
    """Retrieve all inventory items for the user, ordered by created_at descending."""
    return (
        db.query(InventoryItem)
        .filter(InventoryItem.user_id == user_id)
        .order_by(InventoryItem.created_at.desc())
        .all()
    )


def update_item(
    db: Session, item_id: int, user_id: int, item: InventoryCreate
) -> Optional[InventoryItem]:
    """Update an existing inventory item if it belongs to user_id. Returns None if not found or not owned."""
    db_item = (
        db.query(InventoryItem)
        .filter(InventoryItem.id == item_id, InventoryItem.user_id == user_id)
        .first()
    )
    if not db_item:
        return None

    db_item.product_name = item.product_name
    db_item.quantity = item.quantity
    db_item.cost_price = item.cost_price
    db_item.selling_price = item.selling_price

    db.commit()
    db.refresh(db_item)
    return db_item


def delete_item(db: Session, item_id: int, user_id: int) -> bool:
    """Delete an inventory item if it belongs to user_id. Returns True if deleted, False if not found or not owned."""
    db_item = (
        db.query(InventoryItem)
        .filter(InventoryItem.id == item_id, InventoryItem.user_id == user_id)
        .first()
    )
    if not db_item:
        return False

    db.delete(db_item)
    db.commit()
    return True
