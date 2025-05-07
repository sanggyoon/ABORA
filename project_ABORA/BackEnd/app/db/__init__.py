# app/db/__init_db.py
from app.db.session import engine, Base

def init():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init()
