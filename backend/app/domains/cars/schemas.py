from __future__ import annotations

from pydantic import BaseModel, Field

from app.domains.cars.models import BodyType, FuelType, TransmissionType


class PriceRange(BaseModel):
    min: float
    max: float


class CarFilterInput(BaseModel):
    q: str | None = None
    min_price: float | None = Field(default=None, ge=0)
    max_price: float | None = Field(default=None, ge=0)
    body_types: list[BodyType] | None = None
    fuel_type: FuelType | None = None
    transmission: TransmissionType | None = None
    seating_capacity: int | None = Field(default=None, ge=2, le=9)


class PaginationInput(BaseModel):
    limit: int = Field(default=12, ge=1, le=50)
    offset: int = Field(default=0, ge=0)


class CarListMeta(BaseModel):
    total: int
    limit: int
    offset: int
