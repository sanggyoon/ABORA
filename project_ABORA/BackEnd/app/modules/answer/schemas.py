# 📁 app/modules/answer/schemas.py

from pydantic import BaseModel
from datetime import datetime

class AnswerCreate(BaseModel):
    question_id: int
    speaker: str
    content: str

class AnswerRead(BaseModel):
    id: int
    question_id: int
    speaker: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True  # SQLAlchemy -> Pydantic 자동 변환