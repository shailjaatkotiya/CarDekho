from app.domains.discovery.engine import RecommendationEngine
from app.domains.discovery.schemas import DiscoveryInput


def test_recommendation_engine_ranks_budget_fit_first() -> None:
    engine = RecommendationEngine()
    variants = [
        {
            "id": "1",
            "make": {"name": "A"},
            "model": {"name": "X", "bodyType": "suv"},
            "variant": "Base",
            "priceRange": {"min": 10.0, "max": 10.0},
            "fuelType": "petrol",
            "transmission": "automatic",
            "topSafetyRating": 4.5,
            "topMileage": 18.0,
            "seatingCapacity": 5,
            "rangeKm": None,
        },
        {
            "id": "2",
            "make": {"name": "B"},
            "model": {"name": "Y", "bodyType": "suv"},
            "variant": "Top",
            "priceRange": {"min": 24.0, "max": 24.0},
            "fuelType": "petrol",
            "transmission": "automatic",
            "topSafetyRating": 4.5,
            "topMileage": 18.0,
            "seatingCapacity": 5,
            "rangeKm": None,
        },
    ]
    result = engine.recommend(
        variants,
        DiscoveryInput(
            budget=12,
            usage="mixed",
            family_size=4,
            fuel_preferences=["petrol"],
            transmission_preference="automatic",
        ),
    )
    assert result[0].car["id"] == "1"
