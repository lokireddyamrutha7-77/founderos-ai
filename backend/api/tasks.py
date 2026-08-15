from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.user import User
from models.task import Task as TaskModel
from schemas.task import TaskCreate, TaskResponse
from services.security import get_current_user
from datetime import datetime

router = APIRouter(prefix="/tasks", tags=["Tasks"])

def success(data):
    return {"success": True, "data": data, "error": None}

@router.get("/")
def get_tasks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tasks = db.query(TaskModel).filter(TaskModel.user_id == current_user.id).order_by(TaskModel.created_at.desc()).all()
    results = []
    for t in tasks:
        results.append({
            "id": f"tsk_{t.id}",
            "title": t.title,
            "completed": t.completed,
            "dueDate": t.due_date.isoformat() if t.due_date else None
        })
    return success(results)

@router.post("/")
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    due_date_dt = None
    if task.dueDate:
        try:
            due_date_dt = datetime.fromisoformat(task.dueDate.replace('Z', '+00:00'))
        except:
            pass
    db_task = TaskModel(
        title=task.title,
        completed=task.completed,
        due_date=due_date_dt,
        user_id=current_user.id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return success({
        "id": f"tsk_{db_task.id}",
        "title": db_task.title,
        "completed": db_task.completed,
        "dueDate": db_task.due_date.isoformat() if db_task.due_date else None
    })

@router.put("/{task_id}/toggle")
def toggle_task(task_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        actual_id = int(task_id.replace("tsk_", ""))
    except:
        raise HTTPException(status_code=400, detail="Invalid task id")
    db_task = db.query(TaskModel).filter(TaskModel.id == actual_id, TaskModel.user_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_task.completed = not db_task.completed
    db.commit()
    db.refresh(db_task)
    return success({
        "id": f"tsk_{db_task.id}",
        "title": db_task.title,
        "completed": db_task.completed,
        "dueDate": db_task.due_date.isoformat() if db_task.due_date else None
    })
