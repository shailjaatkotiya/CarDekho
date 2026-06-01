from __future__ import annotations

import strawberry


@strawberry.type
class ReviewType:
    id: strawberry.ID
    variant_id: strawberry.ID
    rating_overall: float
    rating_value: float
    rating_comfort: float
    rating_performance: float
    rating_mileage: float
    rating_features: float
    rating_service: float
    body: str
    ownership_months: int
    upvotes: int
    is_verified: bool
    created_at: str | None
