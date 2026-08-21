from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.database import SessionLocal

from backend.app.models.category import Category
from backend.app.models.task import Task
from backend.app.models.time_session import TimeSession
from backend.app.models.weekly_plan import WeeklyPlan
from backend.app.models.weekly_plan_item import WeeklyPlanItem

from backend.app.schemas.weekly_plan import (
    WeeklyPlanCreate,
    WeeklyPlanItemUpdate,
    WeeklyPlanResponse,
)

from backend.app.schemas.weekly_dashboard import (
    WeeklyDashboardResponse,
    WeeklyDashboardDay,
    WeeklyDashboardItem,
)


router = APIRouter(
    prefix="/api/weekly-plans",
    tags=["Weekly Plans"],
)


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


DAY_NAMES = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
]


# =========================================================
# Create weekly plan
# =========================================================

@router.post(
    "",
    response_model=WeeklyPlanResponse,
    status_code=201,
)
def create_weekly_plan(
    data: WeeklyPlanCreate,
    db: Session = Depends(get_db),
):

    existing_plan = (
        db.query(WeeklyPlan)
        .filter(
            WeeklyPlan.week_start == data.week_start
        )
        .first()
    )

    if existing_plan:

        raise HTTPException(
            status_code=400,
            detail="Weekly plan already exists",
        )


    week_end = (
        data.week_start
        + timedelta(days=6)
    )


    plan = WeeklyPlan(
        week_start=data.week_start,
        week_end=week_end,
    )

    db.add(plan)
    db.flush()


    for item_data in data.items:

        category = (
            db.query(Category)
            .filter(
                Category.id == item_data.category_id
            )
            .first()
        )

        if not category:

            raise HTTPException(
                status_code=404,
                detail=(
                    f"Category "
                    f"{item_data.category_id} "
                    f"not found"
                ),
            )


        item = WeeklyPlanItem(
            weekly_plan_id=plan.id,
            category_id=item_data.category_id,
            day_of_week=item_data.day_of_week,
            planned_minutes=item_data.planned_minutes,
        )

        db.add(item)


    db.commit()
    db.refresh(plan)

    return plan


# =========================================================
# Get weekly plan
# =========================================================

@router.get(
    "/{week_start}",
    response_model=WeeklyPlanResponse,
)
def get_weekly_plan(
    week_start: date,
    db: Session = Depends(get_db),
):

    plan = (
        db.query(WeeklyPlan)
        .filter(
            WeeklyPlan.week_start == week_start
        )
        .first()
    )

    if not plan:

        raise HTTPException(
            status_code=404,
            detail="Weekly plan not found",
        )

    return plan


# =========================================================
# Update weekly plan item
# =========================================================

@router.put(
    "/items/{item_id}",
    response_model=WeeklyPlanResponse,
)
def update_weekly_plan_item(
    item_id: int,
    data: WeeklyPlanItemUpdate,
    db: Session = Depends(get_db),
):

    item = (
        db.query(WeeklyPlanItem)
        .filter(
            WeeklyPlanItem.id == item_id
        )
        .first()
    )

    if not item:

        raise HTTPException(
            status_code=404,
            detail="Weekly plan item not found",
        )


    item.planned_minutes = (
        data.planned_minutes
    )

    db.commit()


    plan = (
        db.query(WeeklyPlan)
        .filter(
            WeeklyPlan.id
            == item.weekly_plan_id
        )
        .first()
    )

    return plan


# =========================================================
# Delete weekly plan item
# =========================================================

@router.delete(
    "/items/{item_id}",
    status_code=204,
)
def delete_weekly_plan_item(
    item_id: int,
    db: Session = Depends(get_db),
):

    item = (
        db.query(WeeklyPlanItem)
        .filter(
            WeeklyPlanItem.id == item_id
        )
        .first()
    )

    if not item:

        raise HTTPException(
            status_code=404,
            detail="Weekly plan item not found",
        )


    db.delete(item)
    db.commit()


# =========================================================
# Weekly dashboard
# =========================================================

@router.get(
    "/{week_start}/dashboard",
    response_model=WeeklyDashboardResponse,
)
def get_weekly_dashboard(
    week_start: date,
    db: Session = Depends(get_db),
):

    plan = (
        db.query(WeeklyPlan)
        .filter(
            WeeklyPlan.week_start == week_start
        )
        .first()
    )

    if not plan:

        raise HTTPException(
            status_code=404,
            detail="Weekly plan not found",
        )


    days = []


    for day_of_week in range(7):

        current_date = (
            week_start
            + timedelta(days=day_of_week)
        )


        plan_items = (
            db.query(WeeklyPlanItem)
            .filter(
                WeeklyPlanItem.weekly_plan_id
                == plan.id,

                WeeklyPlanItem.day_of_week
                == day_of_week,
            )
            .all()
        )


        dashboard_items = []


        for item in plan_items:

            category = (
                db.query(Category)
                .filter(
                    Category.id
                    == item.category_id
                )
                .first()
            )

            if not category:
                continue


            tasks = (
                db.query(Task)
                .filter(
                    Task.category_id
                    == item.category_id,

                    Task.date
                    == current_date,
                )
                .all()
            )


            actual_seconds = 0


            for task in tasks:

                sessions = (
                    db.query(TimeSession)
                    .filter(
                        TimeSession.task_id
                        == task.id,

                        TimeSession.duration_seconds
                        .isnot(None),
                    )
                    .all()
                )


                for session in sessions:

                    actual_seconds += (
                        session.duration_seconds
                        or 0
                    )


            actual_minutes = (
                actual_seconds // 60
            )


            remaining_minutes = max(
                item.planned_minutes
                - actual_minutes,
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

                progress_percent = 0


            dashboard_items.append(
                WeeklyDashboardItem(
                    category_id=item.category_id,
                    category_name=category.name,
                    planned_minutes=item.planned_minutes,
                    actual_minutes=actual_minutes,
                    remaining_minutes=remaining_minutes,
                    progress_percent=progress_percent,
                )
            )


        days.append(
            WeeklyDashboardDay(
                date=current_date,
                day_of_week=day_of_week,
                day_name=DAY_NAMES[day_of_week],
                items=dashboard_items,
            )
        )


    return WeeklyDashboardResponse(
        week_start=plan.week_start,
        week_end=plan.week_end,
        days=days,
    )