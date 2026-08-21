from datetime import date

from pydantic import BaseModel, Field


class WeeklyPlanItemCreate(BaseModel):

    category_id: int

    day_of_week: int = Field(
        ge=0,
        le=6,
    )

    planned_minutes: int = Field(
        ge=0,
    )


class WeeklyPlanCreate(BaseModel):

    week_start: date

    items: list[WeeklyPlanItemCreate]


class WeeklyPlanItemUpdate(BaseModel):

    planned_minutes: int = Field(
        ge=0,
    )


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