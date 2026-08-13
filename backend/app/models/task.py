from datetime import date, datetime
from sqlalchemy import Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database.database import Base

class Task(Base):
    __tablename__ = 'tasks'
    id: Mapped[int] = mapped_column(primary_key=True,index=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )

    date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    planned_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    category = relationship(
        "Category",
        backref="tasks",
    )
    time_sessions = relationship(
        "TimeSession",
        back_populates="task",
        cascade="all, delete-orphan",
    )