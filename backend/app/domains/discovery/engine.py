from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from app.domains.discovery.reasoning import build_reasoning
from app.domains.discovery.schemas import DiscoveryInput, RecommendationScore
from app.domains.discovery.scorer import RecommendationScorer


@dataclass
class RecommendationResult:
    car: dict[str, Any]
    score: RecommendationScore


class RecommendationEngine:
    def __init__(self) -> None:
        self.scorer = RecommendationScorer()

    def _score_variant(self, variant: dict[str, Any], inputs: DiscoveryInput) -> RecommendationScore:
        proxy = type(
            "VariantProxyImpl",
            (),
            {
                "id": variant["id"],
                "price": variant["priceRange"]["min"],
                "mileage": variant.get("topMileage"),
                "range_km": variant.get("rangeKm"),
                "safety": variant.get("topSafetyRating"),
                "seating": variant["seatingCapacity"],
                "fuel_type": variant["fuelType"],
                "transmission": variant["transmission"],
                "body_type": variant["model"]["bodyType"],
            },
        )()

        scores = {
            "budget_fit": self.scorer.score_budget(proxy, inputs),
            "mileage_fit": self.scorer.score_mileage(proxy, inputs),
            "safety_fit": self.scorer.score_safety(proxy, inputs),
            "seating_fit": self.scorer.score_seating(proxy, inputs),
            "fuel_preference_fit": self.scorer.score_fuel(proxy, inputs),
            "transmission_fit": self.scorer.score_transmission(proxy, inputs),
        }
        total = sum(scores[key] * self.scorer.WEIGHTS[key] for key in scores)
        reasoning, tradeoffs, best_for = build_reasoning(
            make=variant["make"]["name"],
            model=variant["model"]["name"],
            price=proxy.price,
            mileage=proxy.mileage,
            range_km=proxy.range_km,
            safety=proxy.safety,
            scores=scores,
            inputs=inputs,
        )
        return RecommendationScore(
            total=round(total, 4),
            breakdown=scores,
            reasoning=reasoning,
            tradeoffs=tradeoffs,
            best_for=best_for,
        )

    def recommend(self, variants: list[dict[str, Any]], inputs: DiscoveryInput) -> list[RecommendationResult]:
        scored = [
            RecommendationResult(car=variant, score=self._score_variant(variant, inputs))
            for variant in variants
        ]
        scored.sort(key=lambda item: item.score.total, reverse=True)
        return scored
