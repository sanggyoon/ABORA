# 📁 app/modules/ai/router.py (수정)

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.ai.logic import run_structured_chat
from app.modules.question import crud as question_crud, schemas as question_schemas
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["AI"])

class ChatRequest(BaseModel):
    chatsession_id: int  # 질문을 저장하기 위한 세션 ID
    user_idea: str

@router.post("/generate")
def generate_ai_discussion(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # ✅ 질문 먼저 저장
        question = question_crud.create_question(db, question_schemas.QuestionCreate(
            chatsession_id=request.chatsession_id,
            userprompt=request.user_idea
        ))

        # ✅ 질문 ID와 함께 AI 대화 실행
        result = run_structured_chat(request.user_idea, db=db, question_id=question.id)

        return {
            "conversation": result["conversation"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))