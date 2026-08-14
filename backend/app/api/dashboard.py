from datetime import date, datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.database.database import SessionLocal
from backend.app.models.category import Category
from backend.app.models.task import Task
from backend.app.models.time_session import TimeSession
from backend.app.schemas.dashboard import CategoryDashboardItem,DashboardResponse

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/today",response_model=DashboardResponse)
def get_today_dashboard(db: Session = Depends(get_db)):

    today = date.today()

    tasks = db.query(Task).filter(Task.date == today).all()

    planned_minutes = sum(task.planned_minutes for task in tasks)

    actual_seconds = (
        db.query(func.coalesce(func.sum(TimeSession.duration_seconds),0)).join(Task)
        .filter(Task.date == today, TimeSession.duration_seconds.is_not(None))
        .scalar()
    )

    actual_minutes = actual_seconds / 60

    remaining_minutes = max(planned_minutes - actual_minutes, 0)

    if planned_minutes > 0:
        progress_percentage = (actual_minutes / planned_minutes) * 100
    else:
        progress_percentage = 0

    progress_percentage = min(progress_percentage,100)

    categories = db.query(Category).join(Task).filter(Task.date == today).distinct().all()
    category_items = []

    for category in categories:
        category_tasks = [task for task in tasks if task.category_id == category.id]

        category_planned = sum(task.planned_minutes for task in category_tasks)

        category_actual_seconds = (
            db.query(func.coalesce(func.sum(TimeSession.duration_seconds),0)).join(Task)
            .filter(
                Task.category_id == category.id,
                Task.date == today,
                TimeSession.duration_seconds.is_not(None),
            )
            .scalar()
        )

        category_actual = (category_actual_seconds / 60)

        category_remaining = max(category_planned - category_actual,0)

        if category_planned > 0:
            category_progress = (category_actual / category_planned) * 100
        else:
            category_progress = 0

        category_progress = min(category_progress,100)

        category_items.append(
            CategoryDashboardItem(
                category_id= category.id,
                category_name=category.name,
                planned_minutes=category_planned,
                actual_minutes=round(
                    category_actual,
                    2,
                ),
                remaining_minutes=round(
                    category_remaining,
                    2,
                ),
                progress_percentage=round(
                    category_progress,
                    2,
                ),
            )
        )

    return DashboardResponse(
        date=today,
        planned_minutes=planned_minutes,
        actual_minutes=round(
            actual_minutes,
            2,
        ),
        remaining_minutes=round(
            remaining_minutes,
            2,
        ),
        progress_percentage=round(
            progress_percentage,
            2,
        ),
        categories=category_items,
    )