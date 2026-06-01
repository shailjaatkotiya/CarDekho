from __future__ import annotations

import asyncio
import json
from pathlib import Path

from sqlalchemy import select

from app.core.database import Base, SessionLocal, engine
from app.domains.cars.models import (
    BodyType,
    Feature,
    FeatureCategory,
    FuelType,
    Make,
    Model,
    OnRoadPriceRule,
    PriceHistory,
    TransmissionType,
    Variant,
    VariantFeature,
    VariantImage,
    VariantSpec,
)


def normalize_transmission(value: str) -> TransmissionType:
    mapping = {
        "manual": TransmissionType.MANUAL,
        "amt": TransmissionType.AMT,
        "cvt": TransmissionType.CVT,
        "dct": TransmissionType.DCT,
        "torque converter": TransmissionType.AUTOMATIC,
        "single speed automatic": TransmissionType.AUTOMATIC,
        "automatic": TransmissionType.AUTOMATIC,
    }
    return mapping.get(value.lower().strip(), TransmissionType.AUTOMATIC)


def normalize_fuel(value: str) -> FuelType:
    mapping = {
        "petrol": FuelType.PETROL,
        "diesel": FuelType.DIESEL,
        "cng": FuelType.CNG,
        "electric": FuelType.ELECTRIC,
        "hybrid": FuelType.HYBRID,
        "phev": FuelType.PHEV,
    }
    return mapping.get(value.lower().strip(), FuelType.PETROL)


def normalize_body_type(value: str) -> BodyType:
    mapping = {
        "suv": BodyType.SUV,
        "sedan": BodyType.SEDAN,
        "hatchback": BodyType.HATCHBACK,
        "muv": BodyType.MUV,
        "pickup": BodyType.PICKUP,
        "luxury": BodyType.LUXURY,
        "coupe": BodyType.COUPE,
        "convertible": BodyType.CONVERTIBLE,
    }
    return mapping.get(value.lower().strip(), BodyType.SUV)


def feature_category(name: str) -> FeatureCategory:
    key = name.lower()
    if "airbag" in key or "adas" in key or "camera" in key or "esp" in key or "abs" in key:
        return FeatureCategory.SAFETY
    if "apple" in key or "android" in key or "touchscreen" in key or "audio" in key:
        return FeatureCategory.INFOTAINMENT
    if "sunroof" in key or "seat" in key or "climate" in key or "ac" in key:
        return FeatureCategory.COMFORT
    return FeatureCategory.CONVENIENCE


def feature_category_from_group(group: str) -> FeatureCategory:
    """Map a cars.json feature group key to a FeatureCategory, preserving the
    source grouping (comfort / infotainment / safety / ownership) instead of
    re-deriving it heuristically from the feature name."""
    try:
        return FeatureCategory(group.lower().strip())
    except ValueError:
        return FeatureCategory.CONVENIENCE


async def seed() -> None:
    data_path = Path(__file__).resolve().parents[1] / "data" / "cars.json"
    payload = json.loads(data_path.read_text(encoding="utf-8"))
    cars = payload.get("cars", [])

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        already_seeded = await session.execute(select(Variant.id).limit(1))
        if already_seeded.scalar_one_or_none():
            return

        feature_map: dict[str, Feature] = {}
        make_map: dict[str, Make] = {}
        model_map: dict[tuple[str, str], Model] = {}

        for car in cars:
            make_name = car["make"]
            model_name = car["model"]
            engine_data = car.get("engine") or {}
            battery_data = car.get("battery") or {}
            make = make_map.get(make_name)
            if not make:
                make = Make(name=make_name)
                session.add(make)
                await session.flush()
                make_map[make_name] = make

            model_key = (make_name, model_name)
            model = model_map.get(model_key)
            if not model:
                model = Model(
                    make_id=make.id,
                    name=model_name,
                    body_type=normalize_body_type(car["bodyType"]),
                    segment=car.get("segment"),
                    is_discontinued=False,
                )
                session.add(model)
                await session.flush()
                model_map[model_key] = model

            variant = Variant(
                model_id=model.id,
                name=car["variant"],
                ex_showroom_price=float(car["exShowroomPriceLakh"]["max"]),
                fuel_type=normalize_fuel(car["preferredFuelType"]),
                transmission=normalize_transmission(car["gearType"]),
                engine_cc=engine_data.get("displacementCc"),
                max_power_bhp=engine_data.get("powerBhP") or battery_data.get("powerBhP"),
                max_torque_nm=engine_data.get("torqueNm") or battery_data.get("torqueNm"),
                mileage_kmpl=car.get("mileageKmpl", {}).get("max") if car.get("mileageKmpl") else None,
                range_km=car.get("rangeKm", {}).get("max") if car.get("rangeKm") else None,
                seating_capacity=car.get("seatingCapacity", 5),
                ground_clearance_mm=car.get("dimensions", {}).get("groundClearanceMm"),
                boot_space_litres=car.get("dimensions", {}).get("bootSpaceLitres"),
                safety_rating=min(5.0, max(1.0, (car.get("featureScore", {}).get("safety", 7) / 2))),
                is_ev=car.get("preferredFuelType") == "electric",
                is_new=True,
            )
            session.add(variant)
            await session.flush()

            session.add(PriceHistory(variant_id=variant.id, price=variant.ex_showroom_price))
            session.add(
                VariantImage(
                    variant_id=variant.id,
                    url=car.get("imageUrl")
                    or f"https://images.example.com/cars/{car['id']}.jpg",
                    image_type="exterior",
                )
            )

            specs = {
                "Engine": {
                    "Engine Type": engine_data.get("type") or "EV motor",
                    "Power (bhp)": str(variant.max_power_bhp or ""),
                    "Torque (Nm)": str(variant.max_torque_nm or ""),
                },
                "Dimensions": {
                    "Ground Clearance (mm)": str(car.get("dimensions", {}).get("groundClearanceMm", "")),
                    "Boot Space (L)": str(car.get("dimensions", {}).get("bootSpaceLitres", "")),
                },
                "Safety": {
                    "Safety Rating": str(variant.safety_rating),
                },
            }
            for group, values in specs.items():
                for key, value in values.items():
                    if value:
                        session.add(
                            VariantSpec(variant_id=variant.id, spec_group=group, spec_key=key, spec_value=value)
                        )

            seen_features: set[str] = set()
            for group_name, group_values in car.get("features", {}).items():
                category = feature_category_from_group(group_name)
                for feature_name in group_values:
                    if feature_name in seen_features:
                        continue
                    seen_features.add(feature_name)
                    feature = feature_map.get(feature_name)
                    if not feature:
                        feature = Feature(name=feature_name, category=category)
                        session.add(feature)
                        await session.flush()
                        feature_map[feature_name] = feature
                    session.add(VariantFeature(variant_id=variant.id, feature_id=feature.id))

        state_rules = [
            OnRoadPriceRule(state_code="MH", rto_pct=11.0, green_tax_flat=0.0, handling_charge_flat=12000),
            OnRoadPriceRule(state_code="KA", rto_pct=12.0, green_tax_flat=0.0, handling_charge_flat=12000),
            OnRoadPriceRule(state_code="DL", rto_pct=10.0, green_tax_flat=0.0, handling_charge_flat=12000),
            OnRoadPriceRule(state_code="GJ", rto_pct=8.0, green_tax_flat=0.0, handling_charge_flat=12000),
        ]
        session.add_all(state_rules)
        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
