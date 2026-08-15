from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.user import User
from models.transaction import Transaction as TransactionModel
from schemas.transaction import TransactionCreate, TransactionResponse
from services.security import get_current_user
from datetime import datetime

router = APIRouter(prefix="/transactions", tags=["Transactions"])

def success(data):
    return {"success": True, "data": data, "error": None}

@router.get("/")
def get_transactions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    txs = db.query(TransactionModel).filter(TransactionModel.user_id == current_user.id).order_by(TransactionModel.date.desc()).all()
    results = []
    for t in txs:
        results.append({
            "id": f"tx_{t.id}",
            "date": t.date.isoformat().split('T')[0],
            "type": t.type,
            "amount": t.amount,
            "category": t.category,
            "description": t.description
        })
    return success(results)

@router.get("/summary")
def get_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    txs = db.query(TransactionModel).filter(TransactionModel.user_id == current_user.id).all()
    inv, rev, exp = 0, 0, 0
    for t in txs:
        if t.type == 'investment': inv += t.amount
        elif t.type == 'revenue': rev += t.amount
        elif t.type == 'expense': exp += t.amount
    return success({
        "investment": inv,
        "revenue": rev,
        "expenses": exp,
        "profit": rev - exp
    })

@router.post("/")
def create_transaction(tx: TransactionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_tx = TransactionModel(
        user_id=current_user.id,
        type=tx.type,
        amount=tx.amount,
        category=tx.category,
        description=tx.description,
        date=datetime.utcnow()
    )
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)

    return success({
        "id": f"tx_{db_tx.id}",
        "date": db_tx.date.isoformat().split('T')[0],
        "type": db_tx.type,
        "amount": db_tx.amount,
        "category": db_tx.category,
        "description": db_tx.description
    })
