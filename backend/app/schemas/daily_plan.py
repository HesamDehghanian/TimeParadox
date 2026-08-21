from datetime import date

from pydantic import BaseModel, Field

class DailyPlanItemCreate(BaseModel):
    task_id: int

    start_minute: int = Field(
        ge=0,
        le=1439,
    )

    duration_minutes: int = Field(
        gt=0,
    )

    position: int = Field(
        ge=0,
    )


class DailyPlanCreate(BaseModel):
    date: date

    items: list[DailyPlanItemCreate]

class DailyPlanItemResponse(BaseModel):
    category_id: int
    category_name: str

    planned_minutes: int
    actual_minutes: int
    remaining_minutes: int
    progress_percent: float


class DailyPlanResponse(BaseModel):
    date: date
    day_of_week: int
    day_name: str

    items: list[DailyPlanItemResponse]

    total_planned_minutes: int
    total_actual_minutes: int
    total_remaining_minutes: int
    total_progress_percent: float
# from datetime import date
#
# from pydantic import BaseModel, Field
#
#
# class DailyPlanItemCreate(BaseModel):
#     task_id: int
#
#     start_minute: int = Field(
#         ge=0,
#         le=1439,
#     )
#
#     duration_minutes: int = Field(
#         gt=0,
#     )
#
#     position: int = Field(
#         ge=0,
#     )
#
#
# class DailyPlanCreate(BaseModel):
#     date: date
#
#     items: list[DailyPlanItemCreate]
#
#
# class DailyPlanItemResponse(BaseModel):
#     id: int
#     task_id: int
#     start_minute: int
#     duration_minutes: int
#     position: int
#
#
# class DailyPlanResponse(BaseModel):
#     id: int
#     date: date
#     items: list[DailyPlanItemResponse]