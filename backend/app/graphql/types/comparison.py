from __future__ import annotations

import strawberry

from app.graphql.types.car import CarType


@strawberry.type
class ComparisonRowType:
    key: str
    label: str
    winner_variant_id: str | None
    values: list[str]


@strawberry.type
class ComparisonType:
    cars: list[CarType]
    winner_per_row: list[ComparisonRowType]
    verdict: str
    buyer_type_match: list[str]
