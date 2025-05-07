# app/test/test_relationships.py

import pytest
from sqlalchemy.orm import Session
from app.modules.user.models import User
from app.modules.chatsession.models import ChatSession
from app.modules.question.models import Question
from app.modules.answer.models import Answer
from app.db.session import Base
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# ✅ SQLite 인메모리 테스트 DB 구성
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ pytest fixture로 세션 제공
@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()

# ✅ 전체 연결 테스트: User → ChatSession → Question → Answer
def test_relationship_chain(db: Session):
    # 1. 사용자 생성
    user = User(username="testuser", email="test@example.com", hashed_password="hashed")
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. 채팅 세션 생성
    session = ChatSession(user_id=user.id, chatsession_name="Test Session")
    db.add(session)
    db.commit()
    db.refresh(session)

    # 3. 질문 생성
    question = Question(chatsession_id=session.id, userprompt="AI가 나 대신 글 써줄 수 있을까?")
    db.add(question)
    db.commit()
    db.refresh(question)

    # 4. AI 응답 생성
    answer = Answer(question_id=question.id, speaker="Gemini", content="물론이야. 글 작성 도와줄게!")
    db.add(answer)
    db.commit()
    db.refresh(answer)

    # ✅ 연결 확인 (ORM relationship 순회)
    assert user.chatsessions[0].id == session.id
    assert session.questions[0].id == question.id
    assert question.answers[0].speaker == "Gemini"
    assert question.answers[0].content == "물론이야. 글 작성 도와줄게!"