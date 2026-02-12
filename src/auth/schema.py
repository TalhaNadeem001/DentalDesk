from pydantic import BaseModel, EmailStr, Field
from src.auth.constants import UserRole


class SignUpRequest(BaseModel):
    firstname: str = Field(min_length=1, max_length=100)
    lastname: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)
    role: UserRole = Field(default=UserRole.USER)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    firstname: str
    lastname: str
    email: str
    role: UserRole

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    user: UserResponse
    session_id: str


class MessageResponse(BaseModel):
    message: str
