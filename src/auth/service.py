from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from redis.asyncio import Redis
from src.auth.models import User
from src.auth.schema import SignUpRequest, UserResponse
from src.auth.utils import hash_password, verify_password, generate_session_id
from src.auth.exceptions import (
    EmailAlreadyExistsError,
    InvalidCredentialsError,
    UserNotFoundError,
    SessionNotFoundError,
)


class AuthService:
    def __init__(self, db: AsyncSession, redis: Redis):
        self.db = db
        self.redis = redis

    async def sign_up(self, request: SignUpRequest) -> UserResponse:
        existing_user = await self.db.scalar(
            select(User).where(User.email == request.email)
        )
        if existing_user:
            raise EmailAlreadyExistsError("Email already registered")
        
        hashed_password = hash_password(request.password)
        new_user = User(
            firstname=request.firstname,
            lastname=request.lastname,
            email=request.email,
            password=hashed_password,
            role=request.role,
        )
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        
        return UserResponse.model_validate(new_user)

    async def login(self, email: str, password: str) -> tuple[UserResponse, str]:
        user = await self.db.scalar(select(User).where(User.email == email))
        if not user:
            raise InvalidCredentialsError("Invalid email or password")
        
        if not verify_password(password, user.password):
            raise InvalidCredentialsError("Invalid email or password")
        
        session_id = generate_session_id()
        user_data = UserResponse.model_validate(user)
        
        await self.redis.setex(
            f"session:{session_id}",
            86400,
            str(user.id),
        )
        
        return user_data, session_id

    async def logout(self, session_id: str) -> None:
        deleted = await self.redis.delete(f"session:{session_id}")
        if not deleted:
            raise SessionNotFoundError("Session not found or already expired")

    async def delete_user(self, user_id: int) -> None:
        user = await self.db.get(User, user_id)
        if not user:
            raise UserNotFoundError("User not found")
        
        await self.db.delete(user)
        await self.db.commit()

    async def get_user_from_session(self, session_id: str) -> UserResponse:
        user_id_str = await self.redis.get(f"session:{session_id}")
        if not user_id_str:
            raise SessionNotFoundError("Session not found or expired")
        
        user_id = int(user_id_str)
        user = await self.db.get(User, user_id)
        if not user:
            raise UserNotFoundError("User not found")
        
        return UserResponse.model_validate(user)
