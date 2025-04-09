# 📁 app/modules/user/crud.py
from app.modules.user.models import User
from app.modules.user.schemas import UserCreate
from app.modules.auth.utils import hash_password
from app.modules.user.fake_db import fake_users_db


def get_user(username: str):
    user = fake_users_db.get(username)
    if user:
        return User(**user)
    return None

def create_user(user_in: UserCreate):
    user_dict = user_in.dict()
    user_dict["hashed_password"] = hash_password(user_dict.pop("password"))
    user_dict["disabled"] = False
    fake_users_db[user_in.username] = user_dict
    return User(**user_dict)

def get_all_users():
    return [User(**data) for data in fake_users_db.values()]