from __future__ import annotations

from dataclasses import dataclass

import strawberry
from strawberry.fastapi import BaseContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.alerts.service import AlertsService
from app.domains.cars.repository import CarsRepository
from app.domains.cars.schemas import CarFilterInput, PaginationInput
from app.domains.cars.service import CarsService
from app.domains.comparison.service import ComparisonService
from app.domains.discovery.engine import RecommendationEngine
from app.domains.discovery.schemas import DiscoveryInput
from app.domains.pricing.calculator import PricingCalculator
from app.domains.reviews.service import ReviewsService
from app.domains.shortlist.service import ShortlistService
from app.graphql.resolvers.mappers import map_car, map_review
from app.graphql.types.car import CarConnectionType, CarType, PageInfoType
from app.graphql.types.comparison import ComparisonRowType, ComparisonType
from app.graphql.types.recommendation import RecommendationType
from app.graphql.types.review import ReviewType


@dataclass
class GraphQLContext(BaseContext):
    session: AsyncSession


@strawberry.input
class GraphQLPaginationInput:
    limit: int = 12
    offset: int = 0


@strawberry.input
class GraphQLCarFilterInput:
    q: str | None = None
    min_price: float | None = None
    max_price: float | None = None
    body_types: list[str] | None = None
    body_type: str | None = None
    fuel_type: str | None = None
    transmission: str | None = None
    seating_capacity: int | None = None


@strawberry.input
class GraphQLDiscoveryInput:
    budget: float = 12.0
    usage: str = "mixed"
    family_size: int = 4
    fuel_preferences: list[str] = strawberry.field(default_factory=list)
    transmission_preference: str | None = None
    safety_importance: int = 3
    mileage_importance: int = 3
    feature_importance: int = 3
    resale_importance: int = 3


@strawberry.input
class ReviewInput:
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


@strawberry.input
class AlertInput:
    alert_type: str
    target_id: int | None = None
    threshold_price: float | None = None


@strawberry.input
class TestDriveInput:
    variant_id: strawberry.ID
    city: str
    preferred_date: str
    name: str
    phone: str


@strawberry.type
class ShortlistItemType:
    id: strawberry.ID
    variant_id: strawberry.ID
    notes: str | None
    share_token: str | None
    saved_at: str | None


@strawberry.type
class BookingType:
    status: str
    message: str


@strawberry.type
class OnRoadPriceType:
    ex_showroom_price: float
    rto_amount: float
    green_tax: float
    handling_charge: float
    total_on_road_price: float


def _to_filter(filter_input: GraphQLCarFilterInput | None) -> CarFilterInput:
    if not filter_input:
        return CarFilterInput()
    body_types = filter_input.body_types
    if not body_types and filter_input.body_type:
        body_types = [filter_input.body_type]
    return CarFilterInput(
        q=filter_input.q,
        min_price=filter_input.min_price,
        max_price=filter_input.max_price,
        body_types=body_types,
        fuel_type=filter_input.fuel_type,
        transmission=filter_input.transmission,
        seating_capacity=filter_input.seating_capacity,
    )


def _to_pagination(page: GraphQLPaginationInput | None) -> PaginationInput:
    if not page:
        return PaginationInput()
    return PaginationInput(limit=page.limit, offset=page.offset)


def _to_discovery_input(payload: GraphQLDiscoveryInput) -> DiscoveryInput:
    return DiscoveryInput(
        budget=payload.budget,
        usage=payload.usage,
        family_size=payload.family_size,
        fuel_preferences=payload.fuel_preferences,
        transmission_preference=payload.transmission_preference,
        safety_importance=payload.safety_importance,
        mileage_importance=payload.mileage_importance,
        feature_importance=payload.feature_importance,
        resale_importance=payload.resale_importance,
    )


@strawberry.type
class Query:
    @strawberry.field
    async def cars(
        self,
        info: strawberry.Info[GraphQLContext],
        filter: GraphQLCarFilterInput | None = None,
        page: GraphQLPaginationInput | None = None,
    ) -> CarConnectionType:
        service = CarsService(CarsRepository(info.context.session))
        car_filter = _to_filter(filter)
        pagination = _to_pagination(page)
        cars, total = await service.list_cars(car_filter=car_filter, pagination=pagination)
        return CarConnectionType(
            nodes=[map_car(car) for car in cars],
            page_info=PageInfoType(total=total, limit=pagination.limit, offset=pagination.offset),
        )

    @strawberry.field
    async def car(self, info: strawberry.Info[GraphQLContext], id: strawberry.ID) -> CarType | None:
        service = CarsService(CarsRepository(info.context.session))
        variant = await service.get_variant(int(id))
        return map_car(variant) if variant else None

    @strawberry.field
    async def similar_cars(
        self, info: strawberry.Info[GraphQLContext], id: strawberry.ID, limit: int = 4
    ) -> list[CarType]:
        service = CarsService(CarsRepository(info.context.session))
        cars = await service.similar(int(id), limit=limit)
        return [map_car(car) for car in cars]

    @strawberry.field
    async def variant(self, info: strawberry.Info[GraphQLContext], id: strawberry.ID) -> CarType | None:
        return await self.car(info, id)

    @strawberry.field
    async def search(
        self,
        info: strawberry.Info[GraphQLContext],
        query: str,
        filter: GraphQLCarFilterInput | None = None,
        page: GraphQLPaginationInput | None = None,
    ) -> CarConnectionType:
        merged = filter or GraphQLCarFilterInput()
        merged.q = query
        return await self.cars(info=info, filter=merged, page=page)

    @strawberry.field
    async def recommend(
        self,
        info: strawberry.Info[GraphQLContext],
        input: GraphQLDiscoveryInput,
    ) -> list[RecommendationType]:
        service = CarsService(CarsRepository(info.context.session))
        variants = await service.list_all(car_filter=CarFilterInput())
        engine = RecommendationEngine()
        recommendations = engine.recommend(variants, _to_discovery_input(input))[:12]
        return [
            RecommendationType(
                car=map_car(item.car),
                confidence_score=round(item.score.total * 100, 2),
                reasoning=item.score.reasoning,
                match_reasons=[
                    f"{dimension}={round(value, 2)}"
                    for dimension, value in item.score.breakdown.items()
                    if value >= 0.7
                ],
                tradeoffs=item.score.tradeoffs,
                best_for=item.score.best_for,
            )
            for item in recommendations
        ]

    @strawberry.field
    async def compare(
        self, info: strawberry.Info[GraphQLContext], variant_ids: list[strawberry.ID]
    ) -> ComparisonType:
        service = CarsService(CarsRepository(info.context.session))
        variants = await service.list_variants_by_ids([int(variant_id) for variant_id in variant_ids])
        comparison = ComparisonService().compare(variants)
        rows = [
            ComparisonRowType(
                key=row["key"],
                label=row["label"],
                winner_variant_id=row["winnerVariantId"],
                values=[f"{variant_id}:{value}" for variant_id, value in row["values"].items()],
            )
            for row in comparison["winnerPerRow"]
        ]
        return ComparisonType(
            cars=[map_car(car) for car in comparison["cars"]],
            winner_per_row=rows,
            verdict=comparison["verdict"],
            buyer_type_match=comparison["buyerTypeMatch"],
        )

    @strawberry.field
    async def shortlist(
        self, info: strawberry.Info[GraphQLContext], token: str | None = None
    ) -> list[ShortlistItemType]:
        service = ShortlistService(info.context.session)
        items = await service.list_items(token=token)
        serialized = [service.serialize(item) for item in items]
        return [
            ShortlistItemType(
                id=item["id"],
                variant_id=item["variantId"],
                notes=item["notes"],
                share_token=item["shareToken"],
                saved_at=item["savedAt"],
            )
            for item in serialized
        ]

    @strawberry.field
    async def reviews(
        self,
        info: strawberry.Info[GraphQLContext],
        variant_id: strawberry.ID,
        page: GraphQLPaginationInput | None = None,
    ) -> list[ReviewType]:
        pagination = _to_pagination(page)
        service = ReviewsService(info.context.session)
        reviews = await service.list_reviews(int(variant_id), pagination.limit, pagination.offset)
        return [map_review(service.serialize(review)) for review in reviews]

    @strawberry.field
    async def upcoming_cars(
        self, info: strawberry.Info[GraphQLContext], page: GraphQLPaginationInput | None = None
    ) -> CarConnectionType:
        service = CarsService(CarsRepository(info.context.session))
        launches = await service.new_launches()
        limit = page.limit if page else 8
        nodes = [map_car(car) for car in launches[:limit]]
        return CarConnectionType(
            nodes=nodes,
            page_info=PageInfoType(total=len(launches), limit=limit, offset=0),
        )


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def save_shortlist(
        self, info: strawberry.Info[GraphQLContext], car_id: strawberry.ID, token: str | None = None
    ) -> ShortlistItemType:
        service = ShortlistService(info.context.session)
        item = await service.save_item(variant_id=int(car_id), token=token or "guest")
        payload = service.serialize(item)
        return ShortlistItemType(
            id=payload["id"],
            variant_id=payload["variantId"],
            notes=payload["notes"],
            share_token=payload["shareToken"],
            saved_at=payload["savedAt"],
        )

    @strawberry.mutation
    async def remove_shortlist(
        self, info: strawberry.Info[GraphQLContext], car_id: strawberry.ID, token: str | None = None
    ) -> bool:
        service = ShortlistService(info.context.session)
        return await service.remove_item(variant_id=int(car_id), token=token or "guest")

    @strawberry.mutation
    async def submit_review(self, info: strawberry.Info[GraphQLContext], input: ReviewInput) -> ReviewType:
        service = ReviewsService(info.context.session)
        review = await service.submit_review(
            {
                "variant_id": int(input.variant_id),
                "rating_overall": input.rating_overall,
                "rating_value": input.rating_value,
                "rating_comfort": input.rating_comfort,
                "rating_performance": input.rating_performance,
                "rating_mileage": input.rating_mileage,
                "rating_features": input.rating_features,
                "rating_service": input.rating_service,
                "body": input.body,
                "ownership_months": input.ownership_months,
            }
        )
        return map_review(service.serialize(review))

    @strawberry.mutation
    async def set_alert(self, info: strawberry.Info[GraphQLContext], input: AlertInput) -> str:
        service = AlertsService(info.context.session)
        alert = await service.set_alert(
            user_id=None,
            alert_type=input.alert_type,
            target_id=input.target_id,
            threshold_price=input.threshold_price,
        )
        return str(alert.id)

    @strawberry.mutation
    async def book_test_drive(self, input: TestDriveInput) -> BookingType:
        return BookingType(
            status="accepted",
            message=f"Test drive request for variant {input.variant_id} submitted for {input.city}.",
        )

    @strawberry.mutation
    async def calculate_on_road_price(
        self, info: strawberry.Info[GraphQLContext], variant_id: strawberry.ID, state_code: str
    ) -> OnRoadPriceType:
        calculator = PricingCalculator(info.context.session)
        value = await calculator.calculate_on_road(int(variant_id), state_code)
        if not value:
            return OnRoadPriceType(
                ex_showroom_price=0.0,
                rto_amount=0.0,
                green_tax=0.0,
                handling_charge=0.0,
                total_on_road_price=0.0,
            )
        return OnRoadPriceType(**value.model_dump())


schema = strawberry.Schema(query=Query, mutation=Mutation)
