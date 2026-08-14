from datetime import date

from pydantic import BaseModel


class CategoryDashboardItem(BaseModel):
    category_id: int
    category_name: str

    planned_minutes: int
    actual_minutes: float
    remaining_minutes: float
    progress_percentage: float


class DashboardResponse(BaseModel):
    date: date

    planned_minutes: int
    actual_minutes: float
    remaining_minutes: float
    progress_percentage: float

    categories: list[CategoryDashboardItem]