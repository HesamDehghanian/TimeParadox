from fastapi import FastAPI

app = FastAPI(
    title="Time Paradox",
    description="Personal time planning and productivity tracking API",
    version="0.1.0",
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to TimeParadox API",
        "version": "0.1.0",
    }

@app.get("/health")
def get_health():
    return {"status": "OK"}