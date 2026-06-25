from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT_DIR / "data" / "cars.json"


class ComparePayload(BaseModel):
    ids: list[str]


class RecommendationInput(BaseModel):
    budget: float = 12
    usage: str = "mixed"
    familySize: int = 4
    fuelPreferences: list[str] = []
    transmissionPreference: str | None = None
    safetyImportance: int = 3
    mileageImportance: int = 3
    featureImportance: int = 3
    resaleImportance: int = 3


app = FastAPI(title="CarDekho JSON API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@lru_cache(maxsize=1)
def load_catalog() -> dict[str, Any]:
    with DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def title_case(value: str) -> str:
    return " ".join(part.capitalize() for part in value.replace("_", " ").replace("-", " ").split())


def make_id(make: str) -> str:
    return make.lower().replace(" ", "-")


def map_car(raw: dict[str, Any]) -> dict[str, Any]:
    feature_groups = [
        {"category": category, "items": items}
        for category, items in raw.get("features", {}).items()
    ]
    features = [item for group in feature_groups for item in group["items"]]
    mileage = raw["mileageKmpl"]["max"] if raw.get("mileageKmpl") else None
    range_value = raw.get("rangeKm")
    if isinstance(range_value, dict):
        range_value = range_value.get("max") or range_value.get("min")
    safety_score = raw.get("featureScore", {}).get("safety")
    make = raw["make"]
    model = raw["model"]

    return {
        "id": raw["id"],
        "make": {"id": make_id(make), "name": make},
        "model": {
            "id": f"{make_id(make)}-{model.lower().replace(' ', '-')}",
            "name": model,
            "bodyType": raw["bodyType"],
            "segment": raw.get("segment"),
        },
        "variant": raw["variant"],
        "priceRange": raw["exShowroomPriceLakh"],
        "fuelType": raw["preferredFuelType"],
        "transmission": raw["gearType"],
        "topSafetyRating": min(5, max(1, round(safety_score / 2))) if safety_score else None,
        "topMileage": mileage,
        "seatingCapacity": raw["seatingCapacity"],
        "images": [raw["imageUrl"]],
        "features": features,
        "featureGroups": feature_groups,
        "isNew": raw.get("modelYear", 0) >= 2026,
        "isEV": raw["preferredFuelType"] == "electric",
        "description": raw.get("productDescription"),
        "idealBuyer": raw.get("idealBuyer"),
        "pros": raw.get("pros", []),
        "tradeoffs": raw.get("tradeoffs", []),
        "recommendationTags": raw.get("recommendationTags", []),
        "rangeKm": range_value,
        "featureScore": raw.get("featureScore", {}),
    }


def all_cars() -> list[dict[str, Any]]:
    return [map_car(car) for car in load_catalog()["cars"]]


def get_car_or_none(car_id: str) -> dict[str, Any] | None:
    return next((car for car in all_cars() if car["id"] == car_id), None)


def matches_filter(
    car: dict[str, Any],
    q: str | None,
    body_types: list[str],
    fuel_type: str | None,
    transmission: str | None,
    min_price: float | None,
    max_price: float | None,
    seating_capacity: int | None,
) -> bool:
    if q:
        haystack = " ".join(
            [
                car["make"]["name"],
                car["model"]["name"],
                car["variant"],
                car["model"]["bodyType"],
                car["model"].get("segment") or "",
            ]
        ).lower()
        if q.lower() not in haystack:
            return False
    if body_types and car["model"]["bodyType"] not in body_types:
        return False
    if fuel_type and car["fuelType"] != fuel_type:
        return False
    if transmission and car["transmission"] != transmission:
        return False
    if min_price is not None and car["priceRange"]["min"] < min_price:
        return False
    if max_price is not None and car["priceRange"]["min"] > max_price:
        return False
    if seating_capacity is not None and car["seatingCapacity"] < seating_capacity:
        return False
    return True


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.get("/api/cars")
def list_cars(
    q: str | None = None,
    bodyTypes: str | None = None,
    fuelType: str | None = None,
    transmission: str | None = None,
    minPrice: float | None = None,
    maxPrice: float | None = None,
    seatingCapacity: int | None = None,
    limit: int = Query(12, ge=1),
    offset: int = Query(0, ge=0),
) -> dict[str, Any]:
    body_types = [item for item in (bodyTypes or "").split(",") if item]
    filtered = [
        car
        for car in all_cars()
        if matches_filter(
            car, q, body_types, fuelType, transmission, minPrice, maxPrice, seatingCapacity
        )
    ]
    return {
        "nodes": filtered[offset : offset + limit],
        "pageInfo": {"total": len(filtered), "limit": limit, "offset": offset},
    }


@app.get("/api/cars/upcoming")
def upcoming_cars() -> list[dict[str, Any]]:
    return [car for car in all_cars() if car["isNew"]][:8]


@app.get("/api/cars/{car_id}")
def car_detail(car_id: str) -> dict[str, Any]:
    car = get_car_or_none(car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car


@app.get("/api/cars/{car_id}/similar")
def similar_cars(car_id: str, limit: int = Query(4, ge=1)) -> list[dict[str, Any]]:
    base = get_car_or_none(car_id)
    if not base:
        return []

    def score(car: dict[str, Any]) -> float:
        value = 0.0
        if car["model"]["bodyType"] == base["model"]["bodyType"]:
            value += 3
        if car["make"]["name"] == base["make"]["name"]:
            value += 2
        value -= abs(car["priceRange"]["min"] - base["priceRange"]["min"]) / 8
        return value

    return sorted(
        [car for car in all_cars() if car["id"] != base["id"]],
        key=score,
        reverse=True,
    )[:limit]


@app.get("/api/cars/{car_id}/reviews")
def reviews(car_id: str) -> list[dict[str, Any]]:
    car = get_car_or_none(car_id)
    if not car:
        return []
    return [
        {
            "id": f"{car['id']}-review-1",
            "variantId": car["id"],
            "ratingOverall": car.get("topSafetyRating") or 4,
            "ratingValue": car.get("featureScore", {}).get("value", 8) / 2,
            "ratingComfort": car.get("featureScore", {}).get("comfort", 8) / 2,
            "ratingPerformance": car.get("featureScore", {}).get("performance", 8) / 2,
            "ratingMileage": 4 if car.get("topMileage") else 3.8,
            "ratingFeatures": car.get("featureScore", {}).get("technology", 8) / 2,
            "ratingService": 4,
            "body": f"{car['make']['name']} {car['model']['name']} feels like a strong fit for {car.get('idealBuyer') or 'daily use'}",
            "ownershipMonths": 8,
            "upvotes": 24,
            "isVerified": True,
            "createdAt": "2026-06-01",
        }
    ]


@app.get("/api/cars/{car_id}/on-road-price")
def on_road_price(car_id: str) -> dict[str, float]:
    car = get_car_or_none(car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"totalOnRoadPrice": round(car["priceRange"]["min"] * 1.16 + 0.35, 2)}


@app.post("/api/compare")
def compare(payload: ComparePayload) -> dict[str, Any]:
    selected = [car for car_id in payload.ids if (car := get_car_or_none(car_id))]
    rows = [
        ("price", "Price", lambda car: car["priceRange"]["min"], min),
        ("mileage", "Mileage", lambda car: car.get("topMileage") or car.get("rangeKm") or 0, max),
        ("safety", "Safety", lambda car: car.get("topSafetyRating") or 0, max),
        ("seating", "Seating", lambda car: car["seatingCapacity"], max),
    ]
    winner_rows = []
    for key, label, value_fn, pick_fn in rows:
        values = [{"id": car["id"], "value": value_fn(car)} for car in selected]
        winner_value = pick_fn([item["value"] for item in values]) if values else 0
        winner_rows.append(
            {
                "key": key,
                "label": label,
                "winnerVariantId": next(
                    (item["id"] for item in values if item["value"] == winner_value), None
                ),
                "values": [f"{item['id']}:{item['value']}" for item in values],
            }
        )

    best = max(
        selected,
        key=lambda car: (car.get("topSafetyRating") or 0) * 1.4
        + (car.get("topMileage") or 0) * 0.25
        + car.get("featureScore", {}).get("value", 0)
        - car["priceRange"]["min"] * 0.15,
        default=None,
    )
    return {
        "cars": selected,
        "winnerPerRow": winner_rows,
        "verdict": (
            f"{best['make']['name']} {best['model']['name']} {best['variant']} leads for balanced value, features, and everyday ownership fit."
            if best
            else "Add cars to compare."
        ),
        "buyerTypeMatch": (
            [best.get("idealBuyer") or "Balanced ownership"]
            + [title_case(tag) for tag in best.get("recommendationTags", [])]
            if best
            else []
        )[:4],
    }


@app.post("/api/recommendations")
def recommendations(input: RecommendationInput) -> list[dict[str, Any]]:
    results = []
    for car in all_cars():
        price_score = max(0, 1 - abs(car["priceRange"]["min"] - input.budget) / max(input.budget, 1))
        fuel_score = 1 if input.fuelPreferences and car["fuelType"] in input.fuelPreferences else 0.55
        seating_score = 1 if car["seatingCapacity"] >= input.familySize else 0.3
        safety_score = ((car.get("topSafetyRating") or 3) / 5) * (input.safetyImportance / 5)
        mileage_value = car.get("topMileage") or ((car.get("rangeKm") or 240) / 20)
        mileage_score = (mileage_value / 25) * (input.mileageImportance / 5)
        feature_score = (car.get("featureScore", {}).get("technology", 6) / 10) * (
            input.featureImportance / 5
        )
        total = (
            price_score * 30
            + fuel_score * 18
            + seating_score * 12
            + safety_score * 16
            + mileage_score * 12
            + feature_score * 12
        )
        results.append(
            {
                "car": car,
                "confidenceScore": round(min(98, max(45, total))),
                "reasoning": car.get("description")
                or f"{car['make']['name']} {car['model']['name']} matches your budget and usage profile.",
                "matchReasons": [
                    f"{title_case(car['fuelType'])} powertrain",
                    f"{car['seatingCapacity']} seats",
                    f"{title_case(car['model']['bodyType'])} body style",
                ],
                "tradeoffs": car.get("tradeoffs", []),
                "bestFor": ([car.get("idealBuyer") or "Balanced ownership"] + car.get("recommendationTags", []))[:4],
            }
        )
    return sorted(results, key=lambda item: item["confidenceScore"], reverse=True)[:12]
