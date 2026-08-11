from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database.database import Base


class WeeklyPlanItem(Base):
    __tablename__ = "weekly_plan_items"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    weekly_plan_id: Mapped[int] = mapped_column(
        ForeignKey("weekly_plans.id"),
        nullable=False,
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        nullable=False,
    )

    planned_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    weekly_plan = relationship(
        "WeeklyPlan",
        backref="items",
    )

    category = relationship(
        "Category",
        backref="weekly_plan_items",
    )