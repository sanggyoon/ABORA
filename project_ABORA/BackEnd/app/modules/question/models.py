# 📁 app/modules/question/models.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.db.session import Base

class Question(Base):
    __tablename__ = "question"
    id = Column(Integer, primary_key=True, index=True)
    chatsession_id = Column(Integer, ForeignKey("chatsession.id"), nullable=False)
    userprompt = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)