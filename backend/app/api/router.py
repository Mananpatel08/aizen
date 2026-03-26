from fastapi import APIRouter
from pydantic import BaseModel
from app.services import generate_answer, web_search

router = APIRouter()


class Query(BaseModel):
    question: str


@router.post("/")
async def chat(query: Query):
    final_answer = await generate_answer(query.question)
    return final_answer
