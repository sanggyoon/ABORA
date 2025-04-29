from pydantic import BaseModel
from datetime import datetime

class ChatSessionCreate(BaseModel):
    user_id: int
    chatsession_name: str

class ChatSessionRead(BaseModel):
    id: int
    user_id: int
    chatsession_name: str
    created_at: datetime

    class Config:
        from_attributes = True