# 📁 app/modules/chatsession/schemas.py
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ChatSessionCreate(BaseModel):
    user_id: int
    chatsession_name: str

class ChatSessionRead(BaseModel):
    id: int
    user_id: int
    chatsession_name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)