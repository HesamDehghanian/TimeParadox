from fastapi import FastAPI

app = FastAPI(
    title="Time Paradox",
    description="Time Paradox",
    version="1.0",
)

@app.get("/")
def read_root():
    return {"Hello": "World"}