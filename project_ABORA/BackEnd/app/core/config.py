# app/core/config.py
import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

load_dotenv()

class Settings(BaseSettings):
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 65

    db_user: str
    db_password: str
    db_host: str
    db_port: str
    db_name: str
    server_name: str
    database_url: str
    openai_api_key: str
    gemini_api_key: str
    perplexity_api_key: str
    google_tts_api_key: str

    model_config = ConfigDict(env_file=".env")

settings = Settings()