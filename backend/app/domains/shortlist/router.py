from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.response import envelope
from app.domains.shortlist.service import ShortlistService

router = APIRouter(prefix="/api/shortlist", tags=["shortlist"])


@router.get("")
async def list_shortlist(
    x_guest_token: str | None = Header(default=None),
    session: AsyncSession = Depends(get_db_session),
):
    service = ShortlistService(session)
    items = await service.list_items(token=x_guest_token)
    return envelope(data=[service.serialize(item) for item in items], meta={"count": len(items)})


@router.post("/{variant_id}")
async def add_shortlist_item(
    variant_id: int,
    x_guest_token: str | None = Header(default=None),
    session: AsyncSession = Depends(get_db_session),
):
    service = ShortlistService(session)
    item = await service.save_item(variant_id=variant_id, token=x_guest_token or "guest")
    return envelope(data=service.serialize(item), meta={})


@router.delete("/{variant_id}")
async def remove_shortlist_item(
    variant_id: int,
    x_guest_token: str | None = Header(default=None),
    session: AsyncSession = Depends(get_db_session),
):
    service = ShortlistService(session)
    removed = await service.remove_item(variant_id=variant_id, token=x_guest_token or "guest")
    return envelope(data={"removed": removed}, meta={})
