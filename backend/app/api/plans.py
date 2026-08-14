from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.database import SessionLocal
from backend.app.models.weekly_plan import WeeklyPlan
from backend.app.models.weekly_plan_item import WeeklyPlanItem
from backend.app.models.category import Category
from backend.app.schemas.daily_plan import DailyPlanResponse, DailyPlanItemResponse


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
def get_today_plan(db: Session = Depends(get_db)):

    today = date.today()
    day_of_week = today.weekday()

    weekly_plan = db.query(WeeklyPlan).filter(WeeklyPlan.week_start <= today,WeeklyPlan.week_end >= today).first()
    if not weekly_plan:
        raise HTTPException(status_code=404,detail="No weekly plan found")

    items = (
        db.query(WeeklyPlanItem,Category.name).join(Category,Category.id == WeeklyPlanItem.category_id)
        .filter(
            WeeklyPlanItem.weekly_plan_id == weekly_plan.id,
            WeeklyPlanItem.day_of_week == day_of_week,
        )
        .all()
    )
    response_items = []
    total_minutes = 0

    for item, category_name in items:

        response_items.append(
            DailyPlanItemResponse(
                category_id=item.category_id,
                category_name=category_name,
                planned_minutes=item.planned_minutes,
            )
        )
        total_minutes += item.planned_minutes


    return DailyPlanResponse(
        date=today,
        day_of_week=day_of_week,
        day_name=today.strftime("%A"),
        items=response_items,
        total_planned_minutes=total_minutes,
    )