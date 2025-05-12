# 📁 app/modules/question/models.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.db.session import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Question(Base):
    __tablename__ = "question"
    id = Column(Integer, primary_key=True, index=True)
    chatsession_id = Column(Integer, ForeignKey("chatsession.id"), nullable=False, default=1)  # 기본값 설정
    userprompt = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    chatsession = relationship("ChatSession", back_populates="questions")
    answers = relationship("Answer", back_populates="question")