# app/db/__init_db.py
from app.db.session import engine, Base
from app.modules.users.models import User  # 필요한 모든 모델 import

def init():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init()
