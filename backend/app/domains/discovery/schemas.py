from __future__ import annotations

from pydantic import BaseModel, Field


class DiscoveryInput(BaseModel):
    budget: float = Field(default=12.0, ge=1.0)
    usage: str = "mixed"
    family_size: int = Field(default=4, ge=1, le=9)
    fuel_preferences: list[str] = []
    transmission_preference: str | None = None
    safety_importance: int = Field(default=3, ge=1, le=5)
    mileage_importance: int = Field(default=3, ge=1, le=5)
    feature_importance: int = Field(default=3, ge=1, le=5)
    resale_importance: int = Field(default=3, ge=1, le=5)


class RecommendationScore(BaseModel):
    total: float
    breakdown: dict[str, float]
    reasoning: str
    tradeoffs: list[str]
    best_for: list[str]
