# 📁 app/modules/user/router.py
from fastapi import APIRouter, HTTPException
from app.modules.user import schemas, crud

router = APIRouter()

@router.post("/", response_model=schemas.UserOut)
def create_user(user_in: schemas.UserCreate):
    if crud.get_user(user_in.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(user_in)

@router.get("/", response_model=list[schemas.UserOut])
def list_users():
    return crud.get_all_users()