# 📁 app/modules/user/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# PK로 User 조회
def get_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        return schemas.UserRead(
            id=db_user.id,
            username=db_user.username,
            email=db_user.email
        )
    return None

# email로 User 조회
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# User 생성
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return schemas.UserRead(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email
    )

# User 삭제
def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()

# User 수정
def update_user(db: Session, user_id: int, user: schemas.UserCreate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.username = user.username
        db_user.email = user.email
        db_user.hashed_password = pwd_context.hash(user.password)
        db.commit()
        db.refresh(db_user)
        return schemas.UserRead(
            id=db_user.id,
            username=db_user.username,
            email=db_user.email
        )
    return None