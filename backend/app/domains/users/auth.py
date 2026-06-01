from __future__ import annotations

from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, create_refresh_token, hash_password, verify_password
from app.domains.users.models import User


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def register(self, email: str, password: str) -> User:
        user = User(email=email, password_hash=hash_password(password))
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def login(self, email: str, password: str) -> dict[str, Any] | None:
        user = (
            await self.session.execute(select(User).where(User.email == email).limit(1))
        ).scalar_one_or_none()
        if not user or not user.password_hash:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return {
            "accessToken": create_access_token(str(user.id)),
            "refreshToken": create_refresh_token(str(user.id)),
            "userId": str(user.id),
        }
