from datetime import date, timedelta

from backend.app.database.database import SessionLocal

from backend.app.models.category import Category
from backend.app.models.task import Task
from backend.app.models.weekly_plan import WeeklyPlan
from backend.app.models.weekly_plan_item import WeeklyPlanItem


db = SessionLocal()


CATEGORIES = {
    "AI Engineer": 360,
    "Master's Exam": 180,
    "English": 180,
    "Recreation": 60,
}


def get_or_create_category(name: str) -> Category:

    category = (
        db.query(Category)
        .filter(Category.name == name)
        .first()
    )

    if category:
        return category

    category = Category(
        name=name,
        description=f"Test category: {name}",
    )

    db.add(category)
    db.flush()

    return category


def get_or_create_weekly_plan(
    week_start: date,
) -> WeeklyPlan:

    week_end = week_start + timedelta(days=6)

    plan = (
        db.query(WeeklyPlan)
        .filter(
            WeeklyPlan.week_start == week_start
        )
        .first()
    )

    if plan:
        return plan

    plan = WeeklyPlan(
        week_start=week_start,
        week_end=week_end,
    )

    db.add(plan)
    db.flush()

    return plan


def seed_week(
    week_start: date,
    categories: dict[str, Category],
):

    plan = get_or_create_weekly_plan(
        week_start
    )

    for day_of_week in range(7):

        current_date = (
            week_start
            + timedelta(days=day_of_week)
        )

        for category_name, planned_minutes in CATEGORIES.items():

            category = categories[category_name]

            existing_item = (
                db.query(WeeklyPlanItem)
                .filter(
                    WeeklyPlanItem.weekly_plan_id == plan.id,
                    WeeklyPlanItem.category_id == category.id,
                    WeeklyPlanItem.day_of_week == day_of_week,
                )
                .first()
            )

            if not existing_item:

                item = WeeklyPlanItem(
                    weekly_plan_id=plan.id,
                    category_id=category.id,
                    day_of_week=day_of_week,
                    planned_minutes=planned_minutes,
                )

                db.add(item)


            existing_task = (
                db.query(Task)
                .filter(
                    Task.category_id == category.id,
                    Task.date == current_date,
                    Task.title == f"Test {category_name}",
                )
                .first()
            )

            if not existing_task:

                task = Task(
                    category_id=category.id,
                    title=f"Test {category_name}",
                    description="Seeded test task for TimeParadox",
                    date=current_date,
                    planned_minutes=planned_minutes,
                )

                db.add(task)


def main():

    print("Creating test categories...")

    categories = {}

    for category_name in CATEGORIES:

        categories[category_name] = (
            get_or_create_category(
                category_name
            )
        )


    print("Creating week 1...")

    seed_week(
        date(2026, 8, 15),
        categories,
    )


    print("Creating week 2...")

    seed_week(
        date(2026, 8, 22),
        categories,
    )


    db.commit()

    print()
    print("Test data created successfully!")
    print()
    print("Weeks:")
    print("2026-08-15 → 2026-08-21")
    print("2026-08-22 → 2026-08-28")


if __name__ == "__main__":

    try:
        main()

    finally:
        db.close()