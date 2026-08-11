from datetime import date, datetime

from sqlalchemy import Date, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from ..database.database import Base


class WeeklyPlan(Base):
    __tablename__ = "weekly_plans"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    week_start: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    week_end: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )