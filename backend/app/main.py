from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import router as chat_router

app = FastAPI()

app.include_router(chat_router, prefix="/chat")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "AIZEN backend running"}
