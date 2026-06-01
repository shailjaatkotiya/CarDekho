from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.cars.models import OnRoadPriceRule, Variant
from app.domains.pricing.schemas import OnRoadPriceResponse


class PricingCalculator:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def calculate_on_road(self, variant_id: int, state_code: str) -> OnRoadPriceResponse | None:
        variant = (
            await self.session.execute(select(Variant).where(Variant.id == variant_id).limit(1))
        ).scalar_one_or_none()
        if not variant:
            return None

        rule = (
            await self.session.execute(
                select(OnRoadPriceRule).where(OnRoadPriceRule.state_code == state_code.upper()).limit(1)
            )
        ).scalar_one_or_none()
        if not rule:
            rule = OnRoadPriceRule(state_code=state_code.upper(), rto_pct=9.0, green_tax_flat=0.0)
            self.session.add(rule)
            await self.session.commit()
            await self.session.refresh(rule)

        ex_showroom = variant.ex_showroom_price
        rto_amount = ex_showroom * (rule.rto_pct / 100)
        total = ex_showroom + rto_amount + rule.green_tax_flat + rule.handling_charge_flat
        return OnRoadPriceResponse(
            ex_showroom_price=round(ex_showroom, 2),
            rto_amount=round(rto_amount, 2),
            green_tax=round(rule.green_tax_flat, 2),
            handling_charge=round(rule.handling_charge_flat, 2),
            total_on_road_price=round(total, 2),
        )


def calculate_emi(principal: float, annual_rate: float, tenure_months: int) -> float:
    monthly_rate = annual_rate / 12 / 100
    numerator = principal * monthly_rate * ((1 + monthly_rate) ** tenure_months)
    denominator = ((1 + monthly_rate) ** tenure_months) - 1
    if denominator == 0:
        return 0.0
    return round(numerator / denominator, 2)
