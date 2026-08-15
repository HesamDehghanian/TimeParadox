from datetime import date

from pydantic import BaseModel


class WeeklyDashboardItem(BaseModel):
    category_id: int
    category_name: str

    planned_minutes: int
    actual_minutes: int
    remaining_minutes: int
    progress_percent: float


class WeeklyDashboardDay(BaseModel):
    date: date
    day_of_week: int
    day_name: str

    items: list[WeeklyDashboardItem]


class WeeklyDashboardResponse(BaseModel):
    week_start: date
    week_end: date

    days: list[WeeklyDashboardDay]