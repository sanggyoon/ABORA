# 📁 app/modules/user/router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import schemas, crud
from app.db.session import get_db
from app.modules.auth.deps import get_current_user
from app.modules.user.models import User

router = APIRouter(prefix="/users", tags=["users"])

# 회원가입은 공개되어 있어야 함
@router.post("/", response_model=schemas.UserRead, status_code=201)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# 내 정보 조회
@router.get("/me", response_model=schemas.UserRead)
def read_my_user(current_user: User = Depends(get_current_user)):
    return schemas.UserRead(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email
    )

# 내 정보 삭제
@router.delete("/me", response_model=dict)
def delete_my_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    crud.delete_user(db, user_id=current_user.id)
    return {"detail": "User deleted successfully"}

# 내 정보 수정
@router.put("/me", response_model=schemas.UserRead)
def update_my_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_user = crud.update_user(db, user_id=current_user.id, user=user)
    return updated_user