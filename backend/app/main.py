from fastapi import FastAPI
from app.api.router import router as chat_router

app = FastAPI()

app.include_router(chat_router, prefix="/chat")


@app.get("/")
def root():
    return {"message": "AIZEN backend running"}
