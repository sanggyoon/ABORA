# app/modules/ai/router.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.modules.ai.logic import run_structured_chat

router = APIRouter(prefix="/ai", tags=["AI"])

class ChatRequest(BaseModel):
    user_idea: str

@router.post("/generate")
def generate_ai_discussion(request: ChatRequest):
    try:
        result = run_structured_chat(request.user_idea)
        return {
            "enhanced_question": result["enhanced_question"],
            "keywords": result["keywords"],
            "market_summary": result["market_summary"],
            "conversation": result["conversation"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))