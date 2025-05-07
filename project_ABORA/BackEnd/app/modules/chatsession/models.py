# 📁 app/modules/chatsession/models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.db.session import Base
from sqlalchemy.orm import relationship

class ChatSession(Base):
    __tablename__ = "chatsession"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    chatsession_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chatsessions")
    questions = relationship("Question", back_populates="chatsession")