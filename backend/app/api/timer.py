from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.database import SessionLocal
from backend.app.models.task import Task
from backend.app.models.time_session import TimeSession
from backend.app.schemas.time_session import TimeSessionResponse


router = APIRouter(
    prefix="/api/timer",
    tags=["Timer"],
)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/start/{task_id}", response_model=TimeSessionResponse,status_code=201)
def start_timer(task_id: int, db: Session = Depends(get_db)):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    active_session = db.query(TimeSession).filter(TimeSession.ended_at.is_(None)).first()

    if active_session:
        raise HTTPException(status_code=400,detail="Another timer is already running")

    session = TimeSession(task_id=task_id,started_at=datetime.now(timezone.utc))

    db.add(session)
    db.commit()
    db.refresh(session)

    return session

@router.post("/stop",response_model=TimeSessionResponse)
def stop_timer(db: Session = Depends(get_db)):

    session = db.query(TimeSession).filter(TimeSession.ended_at.is_(None)).first()

    if not session:
        raise HTTPException(status_code=400,detail="No active timer")

    ended_at = datetime.now(timezone.utc)
    session.ended_at = ended_at
    ended_at_naive = ended_at.replace(tzinfo=None)
    session.duration_seconds = int((ended_at_naive - session.started_at).total_seconds())
    # session.duration_seconds = int((ended_at - session.started_at).total_seconds())

    db.commit()
    db.refresh(session)

    return session

