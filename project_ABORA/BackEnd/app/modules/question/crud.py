# 📁 app/modules/question/crud.py

from sqlalchemy.orm import Session
from . import models, schemas

def create_question(db: Session, question: schemas.QuestionCreate):
    db_question = models.Question(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def get_question(db: Session, question_id: int):
    return db.query(models.Question).filter(models.Question.id == question_id).first()

def get_questions_by_chatsession(db: Session, chatsession_id: int):
    return db.query(models.Question).filter(models.Question.chatsession_id == chatsession_id).all()

def delete_question(db: Session, question_id: int):
    question = get_question(db, question_id)
    if question:
        db.delete(question)
        db.commit()
        return True
    return False