from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from backend.app.database.database import SessionLocal
from backend.app.models.category import Category
from backend.app.models.weekly_plan import WeeklyPlan
from backend.app.models.weekly_plan_item import WeeklyPlanItem
from backend.app.schemas.weekly_plan import WeeklyPlanCreate, WeeklyPlanResponse


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


@router.post("",response_model=WeeklyPlanResponse,status_code=201)
def create_weekly_plan(data: WeeklyPlanCreate, db: Session = Depends(get_db)):

    existing_plan = db.query(WeeklyPlan).filter(WeeklyPlan.week_start == data.week_start).first()
    if existing_plan:
        raise HTTPException(status_code=400, detail="Weekly plan already exists")

    plan = WeeklyPlan(
        week_start=data.week_start,
        week_end=data.week_end,
    )

    db.add(plan)
    db.flush()

    for item_data in data.items:

        category = db.query(Category).filter(Category.id == item_data.category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail=f"Category "f"{item_data.category_id} not found")

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

@router.get("/{week_start}",response_model=WeeklyPlanResponse)
def get_weekly_plan(week_start: date, db: Session = Depends(get_db)):

    plan = db.query(WeeklyPlan).filter(WeeklyPlan.week_start == week_start).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Weekly plan not found")

    return plan