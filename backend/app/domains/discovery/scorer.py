from __future__ import annotations

from app.domains.discovery.schemas import DiscoveryInput


class VariantProxy:
    id: str
    price: float
    mileage: float | None
    range_km: float | None
    safety: float | None
    seating: int
    fuel_type: str
    transmission: str
    body_type: str


class RecommendationScorer:
    WEIGHTS = {
        "budget_fit": 0.30,
        "mileage_fit": 0.20,
        "safety_fit": 0.20,
        "seating_fit": 0.10,
        "fuel_preference_fit": 0.10,
        "transmission_fit": 0.10,
    }

    def score_budget(self, variant: VariantProxy, inputs: DiscoveryInput) -> float:
        if variant.price <= inputs.budget:
            return 1.0
        if variant.price <= inputs.budget * 1.15:
            return 0.65
        if variant.price <= inputs.budget * 1.30:
            return 0.35
        return 0.0

    def score_mileage(self, variant: VariantProxy, inputs: DiscoveryInput) -> float:
        importance = inputs.mileage_importance / 5
        if variant.range_km and variant.range_km >= 350:
            base = 1.0
        elif variant.mileage and variant.mileage >= 20:
            base = 1.0
        elif variant.mileage and variant.mileage >= 16:
            base = 0.7
        else:
            base = 0.4
        return min(1.0, base * (0.6 + importance * 0.4))

    def score_safety(self, variant: VariantProxy, inputs: DiscoveryInput) -> float:
        rating = (variant.safety or 0.0) / 5
        weight_boost = 0.7 + (inputs.safety_importance / 5) * 0.3
        return min(1.0, rating * weight_boost)

    def score_seating(self, variant: VariantProxy, inputs: DiscoveryInput) -> float:
        if variant.seating >= inputs.family_size:
            return 1.0
        if variant.seating + 1 == inputs.family_size:
            return 0.5
        return 0.0

    def score_fuel(self, variant: VariantProxy, inputs: DiscoveryInput) -> float:
        if not inputs.fuel_preferences:
            return 1.0
        return 1.0 if variant.fuel_type in inputs.fuel_preferences else 0.15

    def score_transmission(self, variant: VariantProxy, inputs: DiscoveryInput) -> float:
        if not inputs.transmission_preference or inputs.transmission_preference == "no_preference":
            return 1.0
        return 1.0 if variant.transmission == inputs.transmission_preference else 0.2
