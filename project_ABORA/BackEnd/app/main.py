# app.main.py
from fastapi import FastAPI
from app.modules.user import router as user_router
from app.modules.user.models import Base
from app.db.session import engine
from app.modules.auth.router import router as auth_router
from app.modules.chatsession.router import router as chatsession_router
from app.modules.question.router import router as question_router
from app.modules.answer.router import router as answer_router
from app.modules.ai.router import router as ai_router
from app.modules.tts.router import router as tts_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# 라우터 추가
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(chatsession_router)
app.include_router(question_router)
app.include_router(answer_router)
app.include_router(ai_router)
app.include_router(tts_router) #tts 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 필요한 경우 특정 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#정적 파일 서빙 설정
app.mount("/tts", StaticFiles(directory="public/tts"), name="tts")