# create_tables.py

from app.db.session import engine
from app.modules.user.models import Base  # Base 하나만 import하면 됨

# ✅ 각 모델 import (단, 동일한 Base로 선언된 모델이어야 함)
from app.modules.user import models as user_models
from app.modules.chatsession import models as chatsession_models
from app.modules.question import models as question_models  # 🔽 이 줄 중요

def create_all_tables():
    print("Creating all tables in the database...")
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully.")

if __name__ == "__main__":
    create_all_tables()
