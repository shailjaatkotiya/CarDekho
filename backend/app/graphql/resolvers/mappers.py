from __future__ import annotations

from app.graphql.types.car import (
    CarType,
    FeatureGroupType,
    MakeType,
    ModelType,
    PriceRangeType,
)
from app.graphql.types.review import ReviewType


def map_car(data: dict) -> CarType:
    return CarType(
        id=data["id"],
        make=MakeType(
            id=data["make"]["id"],
            name=data["make"]["name"],
            logo_url=data["make"].get("logoUrl"),
        ),
        model=ModelType(
            id=data["model"]["id"],
            name=data["model"]["name"],
            body_type=data["model"]["bodyType"],
            segment=data["model"].get("segment"),
        ),
        variant=data["variant"],
        price_range=PriceRangeType(min=data["priceRange"]["min"], max=data["priceRange"]["max"]),
        fuel_type=data["fuelType"],
        transmission=data["transmission"],
        top_safety_rating=data.get("topSafetyRating"),
        top_mileage=data.get("topMileage"),
        seating_capacity=data["seatingCapacity"],
        images=data.get("images", []),
        features=data.get("features", []),
        feature_groups=[
            FeatureGroupType(category=group["category"], items=group["items"])
            for group in data.get("featureGroups", [])
        ],
        is_new=data.get("isNew", False),
        is_ev=data.get("isEV", False),
    )


def map_review(data: dict) -> ReviewType:
    return ReviewType(
        id=data["id"],
        variant_id=data["variantId"],
        rating_overall=data["ratingOverall"],
        rating_value=data["ratingValue"],
        rating_comfort=data["ratingComfort"],
        rating_performance=data["ratingPerformance"],
        rating_mileage=data["ratingMileage"],
        rating_features=data["ratingFeatures"],
        rating_service=data["ratingService"],
        body=data["body"],
        ownership_months=data["ownershipMonths"],
        upvotes=data["upvotes"],
        is_verified=data["isVerified"],
        created_at=data["createdAt"],
    )
