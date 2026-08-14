from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TimeSessionResponse(BaseModel):
    id: int
    task_id: int
    started_at: datetime
    ended_at: datetime | None
    duration_seconds: int | None

    model_config = ConfigDict(from_attributes=True)

class ActiveTimerResponse(BaseModel):
    active: bool
    task_id: int | None = None
    session_id: int | None = None
    started_at: datetime | None = None
    elapsed_seconds: int | None = None