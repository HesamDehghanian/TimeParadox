from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database.database import Base


class DailyPlanItem(Base):
    __tablename__ = "daily_plan_items"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    daily_plan_id: Mapped[int] = mapped_column(
        ForeignKey("daily_plans.id"),
        nullable=False,
    )

    task_id: Mapped[int] = mapped_column(
        ForeignKey("tasks.id"),
        nullable=False,
    )

    start_minute: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    duration_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    position: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    daily_plan = relationship(
        "DailyPlan",
        back_populates="items",
    )

    task = relationship(
        "Task",
        backref="daily_plan_items",
    )