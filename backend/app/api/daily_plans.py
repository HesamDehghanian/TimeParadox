from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.database import SessionLocal
from backend.app.models.daily_plan import DailyPlan
from backend.app.models.daily_plan_item import DailyPlanItem
from backend.app.models.task import Task
from backend.app.schemas.daily_plan import (
    DailyPlanItemResponse,
    DailyPlanResponse,
    DailyPlanCreate,
    DailyPlanItemCreate
)


router = APIRouter(
    prefix="/api/daily-plans",
    tags=["Daily Plans"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post(
    "",
    response_model=DailyPlanResponse,
    status_code=201,
)
def create_daily_plan(
    data: DailyPlanCreate,
    db: Session = Depends(get_db),
):

    existing_plan = (
        db.query(DailyPlan)
        .filter(
            DailyPlan.date == data.date
        )
        .first()
    )

    if existing_plan:
        raise HTTPException(
            status_code=400,
            detail="Daily plan already exists",
        )

    plan = DailyPlan(
        date=data.date,
    )

    db.add(plan)
    db.flush()

    for item_data in data.items:

        task = (
            db.query(Task)
            .filter(
                Task.id == item_data.task_id
            )
            .first()
        )

        if not task:
            raise HTTPException(
                status_code=404,
                detail=f"Task {item_data.task_id} not found",
            )

        item = DailyPlanItem(
            daily_plan_id=plan.id,
            task_id=item_data.task_id,
            start_minute=item_data.start_minute,
            duration_minutes=item_data.duration_minutes,
            position=item_data.position,
        )

        db.add(item)

    db.commit()
    db.refresh(plan)

    return plan


@router.get(
    "/{plan_date}",
    response_model=DailyPlanResponse,
)
def get_daily_plan(
    plan_date: date,
    db: Session = Depends(get_db),
):

    plan = (
        db.query(DailyPlan)
        .filter(
            DailyPlan.date == plan_date
        )
        .first()
    )

    if not plan:
        raise HTTPException(
            status_code=404,
            detail="Daily plan not found",
        )

    return plan