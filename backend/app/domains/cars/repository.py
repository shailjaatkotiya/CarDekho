from __future__ import annotations

from sqlalchemy import Select, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domains.cars.models import Make, Model, Variant, VariantFeature, VariantImage, VariantSpec
from app.domains.cars.schemas import CarFilterInput, PaginationInput


class CarsRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    def _build_query(self, car_filter: CarFilterInput | None = None) -> Select[tuple[Variant]]:
        query = (
            select(Variant)
            .options(
                selectinload(Variant.model).selectinload(Model.make),
                selectinload(Variant.features).selectinload(VariantFeature.feature),
                selectinload(Variant.images),
                selectinload(Variant.specs),
            )
            .join(Model, Variant.model_id == Model.id)
            .join(Make, Model.make_id == Make.id)
        )

        if not car_filter:
            return query

        if car_filter.min_price is not None:
            query = query.where(Variant.ex_showroom_price >= car_filter.min_price)
        if car_filter.max_price is not None:
            query = query.where(Variant.ex_showroom_price <= car_filter.max_price)
        if car_filter.body_types:
            query = query.where(Model.body_type.in_(car_filter.body_types))
        if car_filter.fuel_type is not None:
            query = query.where(Variant.fuel_type == car_filter.fuel_type)
        if car_filter.transmission is not None:
            query = query.where(Variant.transmission == car_filter.transmission)
        if car_filter.seating_capacity is not None:
            query = query.where(Variant.seating_capacity >= car_filter.seating_capacity)
        if car_filter.q:
            term = f"%{car_filter.q.lower()}%"
            query = query.where(
                or_(
                    func.lower(Model.name).like(term),
                    func.lower(Make.name).like(term),
                    func.lower(Variant.name).like(term),
                )
            )
        return query

    async def list_variants(
        self,
        car_filter: CarFilterInput | None = None,
        pagination: PaginationInput | None = None,
    ) -> tuple[list[Variant], int]:
        page = pagination or PaginationInput()
        base_query = self._build_query(car_filter)
        count_query = select(func.count()).select_from(base_query.subquery())
        total = (await self.session.execute(count_query)).scalar_one()
        rows = await self.session.execute(base_query.offset(page.offset).limit(page.limit))
        return rows.scalars().all(), int(total)

    async def list_all_variants(self, car_filter: CarFilterInput | None = None) -> list[Variant]:
        """Every matching variant, unpaginated — used by the recommendation engine
        which needs to score the whole catalogue rather than a single page."""
        rows = await self.session.execute(self._build_query(car_filter))
        return rows.scalars().all()

    async def get_variant_by_id(self, variant_id: int) -> Variant | None:
        result = await self.session.execute(
            self._build_query().where(Variant.id == variant_id).limit(1)
        )
        return result.scalar_one_or_none()

    async def list_variants_by_ids(self, variant_ids: list[int]) -> list[Variant]:
        if not variant_ids:
            return []
        result = await self.session.execute(self._build_query().where(Variant.id.in_(variant_ids)))
        return result.scalars().all()

    async def list_similar(self, variant_id: int, limit: int = 4) -> list[Variant]:
        """Sibling models for the comparison brief.

        Prefers other models from the same make (e.g. Amaze -> City); if the make
        has too few, fills the rest with rivals sharing the same body type.
        """
        target = await self.get_variant_by_id(variant_id)
        if not target:
            return []

        make_id = target.model.make_id
        body_type = target.model.body_type

        same_make = (
            await self.session.execute(
                self._build_query()
                .where(Variant.id != variant_id, Model.make_id == make_id)
                .order_by(Variant.ex_showroom_price)
            )
        ).scalars().all()

        results: list[Variant] = list(same_make)
        if len(results) < limit:
            seen = {variant.id for variant in results} | {variant_id}
            same_body = (
                await self.session.execute(
                    self._build_query()
                    .where(Variant.id != variant_id, Model.body_type == body_type)
                    .order_by(Variant.ex_showroom_price)
                )
            ).scalars().all()
            for variant in same_body:
                if variant.id in seen:
                    continue
                results.append(variant)
                seen.add(variant.id)
                if len(results) >= limit:
                    break

        return results[:limit]

    async def list_top_trending(self, limit: int = 10) -> list[Variant]:
        result = await self.session.execute(
            self._build_query().where(Variant.is_new.is_(True)).order_by(Variant.id.desc()).limit(limit)
        )
        return result.scalars().all()

    async def list_new_launches(self, limit: int = 8) -> list[Variant]:
        return await self.list_top_trending(limit=limit)

    async def list_evs(self, limit: int = 10) -> list[Variant]:
        result = await self.session.execute(self._build_query().where(Variant.is_ev.is_(True)).limit(limit))
        return result.scalars().all()

    async def list_used_like(self, limit: int = 20) -> list[Variant]:
        result = await self.session.execute(
            self._build_query().where(Variant.is_new.is_(False)).limit(limit)
        )
        return result.scalars().all()
