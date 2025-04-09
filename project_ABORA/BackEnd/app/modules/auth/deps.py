# 📁 app/modules/auth/deps.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.modules.auth.schemas import TokenData, UserOut
from app.modules.user.fake_db import fake_users_db

SECRET_KEY = "secret"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme)) -> UserOut:
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        user = fake_users_db.get(username)
        if user is None:
            raise credentials_exception
        return UserOut(**user)
    except JWTError:
        raise credentials_exception