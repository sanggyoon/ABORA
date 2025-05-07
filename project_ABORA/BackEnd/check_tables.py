from sqlalchemy import text
from app.db.session import engine  # ← 경로는 실제 위치에 맞게 수정

with engine.connect() as connection:
    result = connection.execute(text("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
    """))
    tables = result.fetchall()
    print("📦 현재 DB에 존재하는 테이블 목록:")
    for table in tables:
        print(" -", table[0])
