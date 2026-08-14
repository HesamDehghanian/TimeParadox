from datetime import date

from pydantic import BaseModel


class DailyPlanItemResponse(BaseModel):
    category_id: int
    category_name: str
    planned_minutes: int


class DailyPlanResponse(BaseModel):
    date: date
    day_of_week: int
    day_name: str

    items: list[DailyPlanItemResponse]

    total_planned_minutes: int