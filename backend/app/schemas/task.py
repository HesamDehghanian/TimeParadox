from datetime import date as date_type, datetime

from pydantic import BaseModel, ConfigDict, Field


class TaskBase(BaseModel):
    category_id: int
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    date: date_type
    planned_minutes: int = Field(gt=0)


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    category_id: int | None = None
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    date: date_type | None = None
    planned_minutes: int | None = Field(default=None, gt=0)


class TaskResponse(TaskBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)