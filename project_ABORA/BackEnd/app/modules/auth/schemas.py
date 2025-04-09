# 📁 app/modules/auth/schemas.py
from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserOut(BaseModel):
    username: str
    full_name: Optional[str] = None
    email: Optional[str] = None