# 📁 app/modules/user/models.py
from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    hashed_password: str
    disabled: bool = False