from fastapi import FastAPI
from app.modules.user import router as user_router
from app.modules.user.models import Base
from app.db.session import engine
from app.modules.auth.router import router as auth_router
from app.modules.chatsession.router import router as chatsession_router  # chatsession 라우터 추가

app = FastAPI()

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# 라우터 추가
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(chatsession_router)  # chatsession 라우터 등록
