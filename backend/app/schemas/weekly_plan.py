from datetime import date

from pydantic import BaseModel, Field


class WeeklyPlanItemCreate(BaseModel):
    category_id: int

    day_of_week: int = Field(
        ge=0,
        le=6,
    )

    planned_minutes: int = Field(
        gt=0,
    )


class WeeklyPlanCreate(BaseModel):
    week_start: date
    week_end: date

    items: list[WeeklyPlanItemCreate]


class WeeklyPlanItemResponse(BaseModel):
    id: int
    category_id: int
    day_of_week: int
    planned_minutes: int


class WeeklyPlanResponse(BaseModel):
    id: int
    week_start: date
    week_end: date
    items: list[WeeklyPlanItemResponse]