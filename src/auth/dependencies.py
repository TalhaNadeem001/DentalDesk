from fastapi import Depends, HTTPException, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis
from src.database import get_db
from src.redis import get_redis
from src.auth.service import AuthService
from src.auth.exceptions import SessionNotFoundError


async def get_auth_service(
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
) -> AuthService:
    return AuthService(db, redis)


async def get_current_session_id(session_id: str | None = Cookie(None)) -> str:
    if not session_id:
        raise HTTPException(status_code=401, detail="Session ID required")
    return session_id


async def get_current_user(
    session_id: str = Depends(get_current_session_id),
    auth_service: AuthService = Depends(get_auth_service),
):
    try:
        return await auth_service.get_user_from_session(session_id)
    except SessionNotFoundError:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
