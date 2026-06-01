from pydantic import BaseModel


class ComparisonRow(BaseModel):
    key: str
    label: str
    winner_variant_id: str | None
    values: dict[str, str]


class ComparisonVerdict(BaseModel):
    verdict: str
    buyer_type_match: list[str]
