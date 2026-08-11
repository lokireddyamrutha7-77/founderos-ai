from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.db import get_db
from models.user import User
from schemas.inventory import InventoryCreate, InventoryResponse
from services.inventory_service import (
    create_item,
    delete_item,
    get_items_by_user,
    update_item,
)
from services.security import get_current_user

router = APIRouter(prefix="/inventory", tags=["Inventory"])


def success(data):
    return {"success": True, "data": data, "error": None}


# ---------------------------------------------------------------------
# Fixed-string routes (/, "") must be declared BEFORE dynamic /{item_id}
# ---------------------------------------------------------------------

# Create Inventory Item
@router.post("", include_in_schema=False)
@router.post("/")
def create_inventory_item_route(
    item: InventoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = create_item(db, current_user.id, item)
    return success(InventoryResponse.model_validate(result).model_dump())


# Get All Inventory Items for Logged-In User
@router.get("", include_in_schema=False)
@router.get("/")
def get_inventory_items_route(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    results = get_items_by_user(db, current_user.id)
    return success([InventoryResponse.model_validate(r).model_dump() for r in results])


# ---------------------------------------------------------------------
# Dynamic /{item_id} routes
# ---------------------------------------------------------------------

# Update Inventory Item
@router.put("/{item_id}")
def update_inventory_item_route(
    item_id: int,
    item: InventoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    updated = update_item(db, item_id, current_user.id, item)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Inventory item with id {item_id} not found",
        )
    return success(InventoryResponse.model_validate(updated).model_dump())


# Delete Inventory Item
@router.delete("/{item_id}")
def delete_inventory_item_route(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = delete_item(db, item_id, current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Inventory item with id {item_id} not found",
        )
    return success({"deleted_id": item_id})
