# 📁 app/modules/question/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from . import schemas, crud

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.post("/", response_model=schemas.QuestionRead, status_code=201)
def create_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db, question)

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