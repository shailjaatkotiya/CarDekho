from __future__ import annotations

from typing import Any

from app.domains.cars.models import Variant
from app.domains.cars.repository import CarsRepository
from app.domains.cars.schemas import CarFilterInput, PaginationInput


def variant_to_dict(variant: Variant) -> dict[str, Any]:
    make = variant.model.make
    model = variant.model
    features = [vf.feature.name for vf in variant.features]

    # Preserve the cars.json feature grouping (safety / comfort / infotainment /
    # ownership) so the detail page can list every feature under its category.
    category_order = ["safety", "comfort", "infotainment", "ownership", "convenience"]
    grouped: dict[str, list[str]] = {}
    for vf in variant.features:
        grouped.setdefault(vf.feature.category.value, []).append(vf.feature.name)
    feature_groups = [
        {"category": category, "items": grouped[category]}
        for category in category_order
        if grouped.get(category)
    ]

    specs_by_group: dict[str, dict[str, str]] = {}
    for spec in variant.specs:
        specs_by_group.setdefault(spec.spec_group, {})[spec.spec_key] = spec.spec_value

    images = [image.url for image in variant.images]
    price = variant.ex_showroom_price
    return {
        "id": str(variant.id),
        "make": {"id": str(make.id), "name": make.name, "logoUrl": make.logo_url},
        "model": {
            "id": str(model.id),
            "name": model.name,
            "bodyType": model.body_type.value,
            "segment": model.segment,
        },
        "variant": variant.name,
        "priceRange": {"min": price, "max": price},
        "fuelType": variant.fuel_type.value,
        "transmission": variant.transmission.value,
        "topSafetyRating": variant.safety_rating,
        "topMileage": variant.mileage_kmpl,
        "seatingCapacity": variant.seating_capacity,
        "engineCc": variant.engine_cc,
        "maxPowerBhp": variant.max_power_bhp,
        "maxTorqueNm": variant.max_torque_nm,
        "rangeKm": variant.range_km,
        "groundClearanceMm": variant.ground_clearance_mm,
        "bootSpaceLitres": variant.boot_space_litres,
        "isNew": variant.is_new,
        "isEV": variant.is_ev,
        "images": images,
        "features": features,
        "featureGroups": feature_groups,
        "specs": specs_by_group,
    }


class CarsService:
    def __init__(self, repository: CarsRepository) -> None:
        self.repository = repository

    async def list_cars(
        self,
        car_filter: CarFilterInput | None = None,
        pagination: PaginationInput | None = None,
    ) -> tuple[list[dict[str, Any]], int]:
        variants, total = await self.repository.list_variants(car_filter=car_filter, pagination=pagination)
        return [variant_to_dict(variant) for variant in variants], total

    async def get_variant(self, variant_id: int) -> dict[str, Any] | None:
        variant = await self.repository.get_variant_by_id(variant_id)
        if not variant:
            return None
        return variant_to_dict(variant)

    async def list_variants_by_ids(self, ids: list[int]) -> list[dict[str, Any]]:
        variants = await self.repository.list_variants_by_ids(ids)
        return [variant_to_dict(variant) for variant in variants]

    async def list_all(self, car_filter: CarFilterInput | None = None) -> list[dict[str, Any]]:
        variants = await self.repository.list_all_variants(car_filter)
        return [variant_to_dict(variant) for variant in variants]

    async def similar(self, variant_id: int, limit: int = 4) -> list[dict[str, Any]]:
        variants = await self.repository.list_similar(variant_id, limit=limit)
        return [variant_to_dict(variant) for variant in variants]

    async def trending(self) -> list[dict[str, Any]]:
        variants = await self.repository.list_top_trending()
        return [variant_to_dict(variant) for variant in variants]

    async def new_launches(self) -> list[dict[str, Any]]:
        variants = await self.repository.list_new_launches()
        return [variant_to_dict(variant) for variant in variants]

    async def electric_cars(self) -> list[dict[str, Any]]:
        variants = await self.repository.list_evs()
        return [variant_to_dict(variant) for variant in variants]

    async def used_like(self) -> list[dict[str, Any]]:
        variants = await self.repository.list_used_like()
        return [variant_to_dict(variant) for variant in variants]
