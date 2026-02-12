from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from sqlmodel import SQLModel
from src.config import settings

# ---------- Base ----------
class Base(DeclarativeBase):
    pass

# Use SQLModel's metadata for compatibility
SQLModel.metadata = Base.metadata

# ---------- Engine ----------
engine = create_async_engine(
    str(settings.DATABASE_URL),  
    echo=False,             
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
)

# ---------- Session ----------
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# ---------- Database Initialization ----------
async def init_db():
    """Initialize database - create all tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# ---------- Dependency ----------
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Alias for get_db for compatibility."""
    async with AsyncSessionLocal() as session:
        yield session
