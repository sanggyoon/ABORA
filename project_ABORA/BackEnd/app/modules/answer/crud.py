# 📁 app/modules/answer/crud.py

from sqlalchemy.orm import Session
from . import models, schemas

def create_answer(db: Session, answer: schemas.AnswerCreate):
    db_answer = models.Answer(**answer.dict())
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

def get_answers_by_question(db: Session, question_id: int):
    return db.query(models.Answer).filter(models.Answer.question_id == question_id).all()

def delete_answer(db: Session, answer_id: int):
    answer = db.query(models.Answer).filter(models.Answer.id == answer_id).first()
    if answer:
        db.delete(answer)
        db.commit()
        return True
    return False