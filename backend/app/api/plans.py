from datetime import date, datetime, time

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.models.task import Task
from backend.app.database.database import SessionLocal
from backend.app.models.weekly_plan import WeeklyPlan
from backend.app.models.weekly_plan_item import WeeklyPlanItem
from backend.app.models.category import Category
from backend.app.schemas.daily_plan import DailyPlanResponse, DailyPlanItemResponse
from backend.app.models.time_session import TimeSession


router = APIRouter(
    prefix="/api/plans",
    tags=["Plans"],
)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/today",response_model=DailyPlanResponse)
@router.get(
    "/today",
    response_model=DailyPlanResponse,
)
def get_today_plan(
    db: Session = Depends(get_db),
):
    today = date.today()

    day_of_week = today.weekday()

    weekly_plan = (
        db.query(WeeklyPlan)
        .filter(
            WeeklyPlan.week_start <= today,
            WeeklyPlan.week_end >= today,
        )
        .first()
    )

    if not weekly_plan:
        raise HTTPException(
            status_code=404,
            detail="No weekly plan found",
        )

    items = (
        db.query(
            WeeklyPlanItem,
            Category.name,
        )
        .join(
            Category,
            Category.id == WeeklyPlanItem.category_id,
        )
        .filter(
            WeeklyPlanItem.weekly_plan_id == weekly_plan.id,
            WeeklyPlanItem.day_of_week == day_of_week,
        )
        .all()
    )

    response_items = []

    total_planned_minutes = 0
    total_actual_minutes = 0

    day_start = datetime.combine(
        today,
        time.min,
    )

    day_end = datetime.combine(
        today,
        time.max,
    )

    for item, category_name in items:

        actual_seconds = (
            db.query(
                TimeSession.duration_seconds,
            )
            .join(
                Task,
                Task.id == TimeSession.task_id,
            )
            .filter(
                Task.category_id == item.category_id,
                TimeSession.started_at >= day_start,
                TimeSession.started_at <= day_end,
                TimeSession.duration_seconds.isnot(None),
            )
            .all()
        )

        actual_minutes = sum(
            duration or 0
            for (duration,) in actual_seconds
        ) // 60

        remaining_minutes = max(
            item.planned_minutes - actual_minutes,
            0,
        )

        if item.planned_minutes > 0:
            progress_percent = min(
                (
                    actual_minutes
                    / item.planned_minutes
                ) * 100,
                100,
            )
        else:
            progress_percent = 0.0

        response_items.append(
            DailyPlanItemResponse(
                category_id=item.category_id,
                category_name=category_name,
                planned_minutes=item.planned_minutes,
                actual_minutes=actual_minutes,
                remaining_minutes=remaining_minutes,
                progress_percent=round(
                    progress_percent,
                    2,
                ),
            )
        )

        total_planned_minutes += (
            item.planned_minutes
        )

        total_actual_minutes += (
            actual_minutes
        )

    total_remaining_minutes = max(
        total_planned_minutes
        - total_actual_minutes,
        0,
    )

    if total_planned_minutes > 0:
        total_progress_percent = min(
            (
                total_actual_minutes
                / total_planned_minutes
            ) * 100,
            100,
        )
    else:
        total_progress_percent = 0.0

    return DailyPlanResponse(
        date=today,
        day_of_week=day_of_week,
        day_name=today.strftime("%A"),
        items=response_items,
        total_planned_minutes=total_planned_minutes,
        total_actual_minutes=total_actual_minutes,
        total_remaining_minutes=total_remaining_minutes,
        total_progress_percent=round(
            total_progress_percent,
            2,
        ),
    )