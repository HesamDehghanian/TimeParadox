from datetime import date, datetime

from sqlalchemy import Date, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database.database import Base


class DailyPlan(Base):
    __tablename__ = "daily_plans"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    date: Mapped[date] = mapped_column(
        Date,
        unique=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    items = relationship(
        "DailyPlanItem",
        back_populates="daily_plan",
        cascade="all, delete-orphan",
    )