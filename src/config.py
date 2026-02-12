from pathlib import Path
from pydantic import PostgresDsn, RedisDsn, model_validator
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

from src.constants import Environment

# Load .env file before creating Config
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    load_dotenv(env_path)


class Config(BaseSettings):
    DATABASE_URL: PostgresDsn
    REDIS_URL: RedisDsn
    ENVIRONMENT: Environment = Environment.DEVELOPMENT

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Config()