# 📁 app/modules/auth/router.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import jwt
from datetime import datetime, timedelta
from app.modules.auth import crud, schemas, deps
from app.modules.user import schemas as user_schemas
from app.modules.user import crud as user_crud
from app.db.session import get_db
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGOㅋRITHM)

@router.post("/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, email=form_data.username, password=form_data.password)  # ✅ 수정
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = crud.create_access_token(data={"sub": user.email})  # ✅ 수정
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: schemas.UserOut = Depends(deps.get_current_user)):
    return current_user

@router.post("/signup", response_model=user_schemas.UserRead)
def signup(user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = user_crud.get_user_by_email(db, email=user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)