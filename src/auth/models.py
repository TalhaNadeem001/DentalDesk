from sqlmodel import SQLModel, Field
from src.auth.constants import UserRole


class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: int | None = Field(default=None, primary_key=True)
    firstname: str = Field(max_length=100)
    lastname: str = Field(max_length=100)
    email: str = Field(unique=True, index=True, max_length=255)
    password: str = Field(max_length=255)
    role: UserRole = Field(default=UserRole.USER)
