# 📁 app/modules/user/schemas.py
from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    pass