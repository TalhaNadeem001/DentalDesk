"""
Redis async client. Add dependency: redis (e.g. uv add redis).
"""
from redis.asyncio import Redis, from_url

from src.config import settings


class RedisClient:
    """Async Redis client. Call start() before use and close() on shutdown."""

    def __init__(self, url: str | None = None):
        self._url = str(url or settings.REDIS_URL or "redis://localhost:6379")
        self.client: Redis | None = None

    async def start(self) -> None:
        self.client = from_url(
            self._url,
            encoding="utf-8",
            decode_responses=True,
        )

    async def close(self) -> None:
        if self.client:
            await self.client.aclose()
            self.client = None


async def get_redis() -> Redis:
    """Return a new Redis client connected to REDIS_URL (for one-off use or dependencies)."""
    url = settings.REDIS_URL or "redis://localhost:6379"
    return from_url(
        str(url),
        encoding="utf-8",
        decode_responses=True,
    )
