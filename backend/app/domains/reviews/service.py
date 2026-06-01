from __future__ import annotations

from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.reviews.models import Review


class ReviewsService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_reviews(self, variant_id: int, limit: int = 10, offset: int = 0) -> list[Review]:
        result = await self.session.execute(
            select(Review)
            .where(Review.variant_id == variant_id)
            .order_by(Review.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return result.scalars().all()

    async def submit_review(self, payload: dict[str, Any]) -> Review:
        review = Review(**payload)
        self.session.add(review)
        await self.session.commit()
        await self.session.refresh(review)
        return review

    @staticmethod
    def serialize(review: Review) -> dict[str, Any]:
        return {
            "id": str(review.id),
            "variantId": str(review.variant_id),
            "ratingOverall": review.rating_overall,
            "ratingValue": review.rating_value,
            "ratingComfort": review.rating_comfort,
            "ratingPerformance": review.rating_performance,
            "ratingMileage": review.rating_mileage,
            "ratingFeatures": review.rating_features,
            "ratingService": review.rating_service,
            "body": review.body,
            "ownershipMonths": review.ownership_months,
            "upvotes": review.upvotes,
            "isVerified": review.is_verified,
            "createdAt": review.created_at.isoformat() if review.created_at else None,
        }
