from __future__ import annotations

import strawberry

from app.graphql.types.car import CarType


@strawberry.type
class RecommendationType:
    car: CarType
    confidence_score: float
    reasoning: str
    match_reasons: list[str]
    tradeoffs: list[str]
    best_for: list[str]
