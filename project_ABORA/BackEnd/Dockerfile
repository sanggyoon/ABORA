# Dockerfile은 컨테이너 이미지를 만들기 위한 설명서(script)

# 베이스 이미지: Python 3.11 slim 버전
FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 시스템 패키지 설치 (예: psycopg2, gcc 등 필요 시)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 종속성 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# FastAPI 소스코드 복사
COPY ./app ./app

# 환경변수 (예: .env에 있는 내용 대신 ENV로 직접 넣을 수도 있음)
ENV PYTHONUNBUFFERED=1

# 실행 명령어: Uvicorn으로 FastAPI 앱 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]