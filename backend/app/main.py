from fastapi import FastAPI

from .database.database import Base, engine
# from .models.category import Category
# from .models.weekly_plan_item import WeeklyPlanItem
# from .models.weekly_plan import WeeklyPlan
# from .models.task import Task
# from .models.time_session import TimeSession
from backend.app.api.categories import router as categories_router
from backend.app.models import Category, Task, TimeSession, WeeklyPlan, WeeklyPlanItem
from backend.app.api.tasks import router as tasks_router
from backend.app.api.timer import router as timer_router
from backend.app.api.dashboard import router as dashboard_router
from backend.app.api.weekly_plans import router as weekly_plans_router
from backend.app.api.plans import router as plans_router
from backend.app.api.daily_plans import router as daily_plans_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Time Paradox",
    description="Personal time planning and productivity tracking API",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories_router)
app.include_router(tasks_router)
app.include_router(timer_router)
app.include_router(dashboard_router)
app.include_router(weekly_plans_router)
app.include_router(plans_router)
app.include_router(daily_plans_router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to TimeParadox API",
        "version": "0.1.0",
    }

@app.get("/health")
def get_health():
    return {"status": "OK"}