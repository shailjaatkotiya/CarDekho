from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.alerts.models import Alert


class AlertsService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def set_alert(
        self,
        *,
        user_id: int | None,
        alert_type: str,
        target_id: int | None,
        threshold_price: float | None,
    ) -> Alert:
        alert = Alert(
            user_id=user_id,
            alert_type=alert_type,
            target_id=target_id,
            threshold_price=threshold_price,
        )
        self.session.add(alert)
        await self.session.commit()
        await self.session.refresh(alert)
        return alert
