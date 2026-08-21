from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from datetime import date
from fastapi import Query
from backend.app.database.database import SessionLocal
from backend.app.models.category import Category
from backend.app.models.task import Task
from backend.app.schemas.task import TaskCreate,TaskResponse,TaskUpdate
from sqlalchemy import func
from backend.app.models.time_session import TimeSession
from backend.app.schemas.task import TaskProgressResponse

router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("", response_model=TaskResponse, status_code=201)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):

    category = db.query(Category).filter(Category.id == task_data.category_id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    task = Task(
        category_id=task_data.category_id,
        title=task_data.title,
        description=task_data.description,
        date=task_data.date,
        planned_minutes=task_data.planned_minutes,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@router.get("",response_model=list[TaskResponse])
def get_tasks(
    date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):

    query = db.query(Task)

    if date is not None:
        query = query.filter(
            Task.date == date
        )

    return (
        query
        .order_by(
            Task.date.asc(),
            Task.created_at.asc(),
        )
        .all()
    )

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404,detail="Task not found")

    return task


@router.put("/{task_id}",response_model=TaskResponse)
def update_task(task_id: int,task_data: TaskUpdate, db: Session = Depends(get_db)):

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404,detail="Task not found")

    update_data = task_data.model_dump(exclude_unset=True)

    if "category_id" in update_data:
        category = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if not category:
            raise HTTPException(status_code=404,detail="Category not found")

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task

@router.delete("/{task_id}",status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404,detail="Task not found")

    db.delete(task)
    db.commit()

@router.get("/{task_id}/progress",response_model=TaskProgressResponse)
def get_task_progress(task_id: int,db: Session = Depends(get_db)):

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404,detail="Task not found")

    total_seconds = (
        db.query(
            func.coalesce(
                func.sum(TimeSession.duration_seconds),
                0,
            )
        )
        .filter(
            TimeSession.task_id == task_id,
            TimeSession.duration_seconds.is_not(None),
        )
        .scalar()
    )

    actual_minutes = total_seconds / 60

    remaining_minutes = max(task.planned_minutes - actual_minutes,0)

    progress_percentage = (actual_minutes / task.planned_minutes) * 100

    progress_percentage = min(progress_percentage,100)

    return TaskProgressResponse(
        task_id=task.id,
        planned_minutes=task.planned_minutes,
        actual_minutes=round(actual_minutes, 2),
        remaining_minutes=round(remaining_minutes, 2),
        progress_percentage=round(progress_percentage, 2),
    )