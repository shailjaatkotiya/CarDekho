from __future__ import annotations

from app.domains.discovery.schemas import DiscoveryInput


def build_reasoning(
    *,
    make: str,
    model: str,
    price: float,
    mileage: float | None,
    range_km: float | None,
    safety: float | None,
    scores: dict[str, float],
    inputs: DiscoveryInput,
) -> tuple[str, list[str], list[str]]:
    reasons: list[str] = []
    tradeoffs: list[str] = []
    best_for: list[str] = []

    if scores["budget_fit"] >= 0.8:
        reasons.append(f"Fits your budget target around Rs {inputs.budget:.1f}L.")
    elif scores["budget_fit"] < 0.4:
        tradeoffs.append("Pricing trends above your current budget range.")

    if range_km:
        reasons.append(f"EV range around {range_km:.0f} km suits daily and weekly planning.")
        best_for.append("EV-focused buyers")
    elif mileage:
        reasons.append(f"Efficiency near {mileage:.1f} kmpl supports predictable running costs.")
        if mileage >= 19:
            best_for.append("High daily commuters")

    if safety and safety >= 4.0:
        reasons.append("Strong safety rating aligns with safety-first priorities.")
        best_for.append("Family safety focused users")
    elif safety and safety < 3.5:
        tradeoffs.append("Safety rating is average versus segment leaders.")

    if inputs.family_size >= 5:
        best_for.append("Family usage")
    if inputs.usage == "highway":
        best_for.append("Highway touring")
    if inputs.usage == "city":
        best_for.append("City commuting")

    if not reasons:
        reasons.append(f"{make} {model} remains a balanced option across your selected criteria.")

    reasoning = " ".join(reasons[:3])
    return reasoning, tradeoffs[:3], list(dict.fromkeys(best_for))[:4]
