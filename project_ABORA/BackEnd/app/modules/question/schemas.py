# 📁 app/modules/question/schemas.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class QuestionCreate(BaseModel):
    chatsession_id: Optional[int] = None
    userprompt: str

class QuestionRead(BaseModel):
    id: int
    chatsession_id: int
    userprompt: str
    created_at: datetime

    class Config:
        from_attributes = True