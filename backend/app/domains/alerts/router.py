from pydantic import BaseModel
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.response import envelope
from app.domains.alerts.service import AlertsService

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


class AlertPayload(BaseModel):
    alert_type: str
    target_id: int | None = None
    threshold_price: float | None = None


@router.post("")
async def create_alert(payload: AlertPayload, session: AsyncSession = Depends(get_db_session)):
    service = AlertsService(session)
    alert = await service.set_alert(
        user_id=None,
        alert_type=payload.alert_type,
        target_id=payload.target_id,
        threshold_price=payload.threshold_price,
    )
    return envelope(data={"alertId": alert.id}, meta={})
