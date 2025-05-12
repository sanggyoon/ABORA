# 📁 app/modules/question/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from . import schemas, crud
from app.modules.answer.crud import get_answers_by_question

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.post("/", response_model=schemas.QuestionRead, status_code=201)
def create_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    # chatsession_id를 자동 설정 (예: 1로 하드코딩 또는 동적으로 설정)
    chatsession_id = 1  # 기본값 또는 동적 조회
    question_data = question.dict()
    question_data["chatsession_id"] = chatsession_id

    return crud.create_question(db, schemas.QuestionCreate(**question_data))

@router.get("/{question_id}", response_model=schemas.QuestionRead)
def read_question(question_id: int, db: Session = Depends(get_db)):
    db_question = crud.get_question(db, question_id)
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question

@router.get("/by_chatsession/{chatsession_id}", response_model=List[schemas.QuestionRead])
def read_questions_by_chatsession(chatsession_id: int, db: Session = Depends(get_db)):
    return crud.get_questions_by_chatsession(db, chatsession_id)

@router.delete("/{question_id}", response_model=dict)
def delete_question(question_id: int, db: Session = Depends(get_db)):
    success = crud.delete_question(db, question_id)
    if not success:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"detail": "Question deleted successfully"}

# ✅ 질문 + 연결된 답변 함께 조회
@router.get("/{question_id}/with_answers")
def get_question_with_answers(question_id: int, db: Session = Depends(get_db)):
    db_question = crud.get_question(db, question_id)
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")

    answers = get_answers_by_question(db, question_id)

    return {
        "question": {
            "id": db_question.id,
            "userprompt": db_question.userprompt,
            "created_at": db_question.created_at
        },
        "answers": [
            {
                "speaker": answer.speaker,
                "content": answer.content,
                "created_at": answer.created_at
            }
            for answer in answers
        ]
    }