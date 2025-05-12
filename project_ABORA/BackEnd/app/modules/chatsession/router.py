# 📁 app/modules/chatsession/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import schemas, crud
from app.db.session import get_db
from app.modules.auth.deps import get_current_user
from app.modules.user.models import User

router = APIRouter(prefix="/chatsessions", tags=["ChatSessions"])

# 채팅 세션 생성
@router.post("/", response_model=schemas.ChatSessionRead, status_code=201)
def create_chatSession(chat_session: schemas.ChatSessionCreate, db: Session = Depends(get_db)):
    return crud.create_chatSession(db=db, chat_session=chat_session)

# 특정 채팅 세션 조회
@router.get("/{session_id}", response_model=schemas.ChatSessionRead)
def read_chatSession(session_id: int, db: Session = Depends(get_db)):
    db_chat_session = crud.get_chatSession(db=db, session_id=session_id)
    if not db_chat_session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return db_chat_session

# 모든 채팅 세션 조회 - 현재 로그인한 사용자의 것만 반환
@router.get("/", response_model=List[schemas.ChatSessionRead])
def read_all_chatSessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_all_chatSessions_by_user(db=db, user_id=current_user.id)

# 채팅 세션 삭제
@router.delete("/{session_id}", response_model=dict)
def delete_chatSession(session_id: int, db: Session = Depends(get_db)):
    success = crud.delete_chatSession(db=db, session_id=session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return {"detail": "Chat session deleted successfully"}