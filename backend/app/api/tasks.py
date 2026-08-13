from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from backend.app.database.database import SessionLocal
from backend.app.models.category import Category
from backend.app.models.task import Task
from backend.app.schemas.task import TaskCreate,TaskResponse,TaskUpdate

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
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

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