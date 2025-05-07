# 📁 app/modules/chatsession/crud.py
from sqlalchemy.orm import Session
from . import models, schemas

# 채팅 세션 생성
def create_chatSession(db: Session, chat_session: schemas.ChatSessionCreate):
    db_chatSession = models.ChatSession(
        user_id=chat_session.user_id,
        chatsession_name=chat_session.chatsession_name
    )
    db.add(db_chatSession)
    db.commit()
    db.refresh(db_chatSession)
    return db_chatSession

# 특정 채팅 세션 조회 (ID로)
def get_chatSession(db: Session, session_id: int):
    return db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()

# 특정 사용자(user_id)의 모든 채팅 세션 조회
def get_all_chatSessions_by_user(db: Session, user_id: int):
    return db.query(models.ChatSession).filter(models.ChatSession.user_id == user_id).all()

# 채팅 세션 삭제
def delete_chatSession(db: Session, session_id: int):
    db_chat_session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if db_chat_session:
        db.delete(db_chat_session)
        db.commit()
        return True
    return False