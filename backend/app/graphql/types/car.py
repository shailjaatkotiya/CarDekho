from __future__ import annotations

import strawberry


@strawberry.type
class MakeType:
    id: strawberry.ID
    name: str
    logo_url: str | None


@strawberry.type
class ModelType:
    id: strawberry.ID
    name: str
    body_type: str
    segment: str | None


@strawberry.type
class PriceRangeType:
    min: float
    max: float


@strawberry.type
class FeatureGroupType:
    category: str
    items: list[str]


@strawberry.type
class CarType:
    id: strawberry.ID
    make: MakeType
    model: ModelType
    variant: str
    price_range: PriceRangeType
    fuel_type: str
    transmission: str
    top_safety_rating: float | None
    top_mileage: float | None
    seating_capacity: int
    images: list[str]
    features: list[str]
    feature_groups: list[FeatureGroupType]
    is_new: bool
    # Frontend queries this field as `isEV` (all-caps), which is not the
    # default camelCase Strawberry would derive from `is_ev` (`isEv`).
    is_ev: bool = strawberry.field(name="isEV")


@strawberry.type
class PageInfoType:
    total: int
    limit: int
    offset: int


@strawberry.type
class CarConnectionType:
    nodes: list[CarType]
    page_info: PageInfoType
