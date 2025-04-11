from fastapi import FastAPI
from app.modules.user import router as user_router
from app.modules.user.models import Base
from app.db.session import engine

app = FastAPI()

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# 라우터 추가
app.include_router(user_router)