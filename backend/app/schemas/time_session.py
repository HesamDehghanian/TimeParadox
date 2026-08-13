from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TimeSessionResponse(BaseModel):
    id: int
    task_id: int
    started_at: datetime
    ended_at: datetime | None
    duration_seconds: int | None

    model_config = ConfigDict(from_attributes=True)