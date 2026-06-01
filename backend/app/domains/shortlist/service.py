from __future__ import annotations

import secrets
from typing import Any

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.shortlist.models import Shortlist


class ShortlistService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_items(self, token: str | None = None, user_id: int | None = None) -> list[Shortlist]:
        query = select(Shortlist)
        if user_id:
            query = query.where(Shortlist.user_id == user_id)
        elif token:
            query = query.where(Shortlist.guest_token == token)
        else:
            return []
        result = await self.session.execute(query.order_by(Shortlist.saved_at.desc()))
        return result.scalars().all()

    async def save_item(
        self, variant_id: int, token: str | None = None, user_id: int | None = None
    ) -> Shortlist:
        share_token = secrets.token_urlsafe(16)
        shortlist = Shortlist(
            user_id=user_id,
            guest_token=token,
            variant_id=variant_id,
            share_token=share_token,
        )
        self.session.add(shortlist)
        await self.session.commit()
        await self.session.refresh(shortlist)
        return shortlist

    async def remove_item(
        self, variant_id: int, token: str | None = None, user_id: int | None = None
    ) -> bool:
        if not token and not user_id:
            return False
        statement = delete(Shortlist).where(Shortlist.variant_id == variant_id)
        if user_id:
            statement = statement.where(Shortlist.user_id == user_id)
        else:
            statement = statement.where(Shortlist.guest_token == token)
        result = await self.session.execute(statement)
        await self.session.commit()
        return bool(result.rowcount)

    @staticmethod
    def serialize(item: Shortlist) -> dict[str, Any]:
        return {
            "id": str(item.id),
            "variantId": str(item.variant_id),
            "notes": item.notes,
            "shareToken": item.share_token,
            "savedAt": item.saved_at.isoformat() if item.saved_at else None,
        }
