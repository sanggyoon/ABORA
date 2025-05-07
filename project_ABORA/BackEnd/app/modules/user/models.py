# 📁 app/modules/user/models.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime, timezone
from app.db.session import Base
from sqlalchemy.orm import relationship

class User(Base):
    # 이 클래스가 어떤 데이터베이스 테이블과 연결될지를 정의
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    chatsessions = relationship("ChatSession", back_populates="user")