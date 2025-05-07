# 📁 app/modules/answer/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from . import schemas, crud

router = APIRouter(prefix="/answers", tags=["Answers"])

@router.post("/", response_model=schemas.AnswerRead, status_code=201)
def create_answer(answer: schemas.AnswerCreate, db: Session = Depends(get_db)):
    return crud.create_answer(db, answer)

@router.get("/by_question/{question_id}", response_model=List[schemas.AnswerRead])
def get_answers_by_question(question_id: int, db: Session = Depends(get_db)):
    return crud.get_answers_by_question(db, question_id)

@router.delete("/{answer_id}", response_model=dict)
def delete_answer(answer_id: int, db: Session = Depends(get_db)):
    success = crud.delete_answer(db, answer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Answer not found")
    return {"detail": "Answer deleted successfully"}