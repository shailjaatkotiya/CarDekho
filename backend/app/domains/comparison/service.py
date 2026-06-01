from __future__ import annotations

from typing import Any


class ComparisonService:
    def compare(self, variants: list[dict[str, Any]]) -> dict[str, Any]:
        if not variants:
            return {"cars": [], "winnerPerRow": [], "verdict": "No variants selected.", "buyerTypeMatch": []}

        rows = [
            ("price", "Price", lambda car: car["priceRange"]["min"], min),
            ("mileage", "Mileage", lambda car: car.get("topMileage") or 0, max),
            ("safety", "Safety", lambda car: car.get("topSafetyRating") or 0, max),
            ("seating", "Seating", lambda car: car.get("seatingCapacity") or 0, max),
        ]

        winner_rows: list[dict[str, Any]] = []
        for key, label, value_fn, pick_fn in rows:
            values = {variant["id"]: value_fn(variant) for variant in variants}
            target_value = pick_fn(values.values()) if values else None
            winner_id = next((vid for vid, val in values.items() if val == target_value), None)
            winner_rows.append(
                {
                    "key": key,
                    "label": label,
                    "winnerVariantId": winner_id,
                    "values": {vid: str(val) for vid, val in values.items()},
                }
            )

        best = max(
            variants,
            key=lambda variant: (variant.get("topSafetyRating") or 0) * 0.35
            + (variant.get("topMileage") or 0) * 0.2
            + (6 - (variant["priceRange"]["min"] / 10)) * 0.2
            + (variant.get("seatingCapacity") or 5) * 0.1,
        )
        verdict = (
            f"{best['make']['name']} {best['model']['name']} {best['variant']} leads for balanced "
            "value, safety, and everyday ownership fit."
        )

        buyer_matches: list[str] = []
        if best.get("topSafetyRating", 0) and best["topSafetyRating"] >= 4:
            buyer_matches.append("Safety-priority buyers")
        if best.get("topMileage", 0) and best["topMileage"] >= 18:
            buyer_matches.append("Mileage-conscious commuters")
        if best.get("seatingCapacity", 0) >= 6:
            buyer_matches.append("Large family buyers")
        if best.get("isEV"):
            buyer_matches.append("EV adopters")

        return {
            "cars": variants,
            "winnerPerRow": winner_rows,
            "verdict": verdict,
            "buyerTypeMatch": buyer_matches,
        }
