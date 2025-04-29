# 📁 app/modules/user/schemas.py
from pydantic import BaseModel, EmailStr, ConfigDict
from app.db.session import engine
from app.modules.user import models

models.Base.metadata.create_all(bind=engine)

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    email: str

    model_config = ConfigDict(from_attributes=True)