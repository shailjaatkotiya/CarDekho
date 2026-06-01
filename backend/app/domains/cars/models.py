from __future__ import annotations

from datetime import datetime
from enum import StrEnum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class BodyType(StrEnum):
    SUV = "suv"
    SEDAN = "sedan"
    HATCHBACK = "hatchback"
    MUV = "muv"
    PICKUP = "pickup"
    LUXURY = "luxury"
    COUPE = "coupe"
    CONVERTIBLE = "convertible"


class FuelType(StrEnum):
    PETROL = "petrol"
    DIESEL = "diesel"
    CNG = "cng"
    ELECTRIC = "electric"
    HYBRID = "hybrid"
    PHEV = "phev"


class TransmissionType(StrEnum):
    MANUAL = "manual"
    AUTOMATIC = "automatic"
    AMT = "amt"
    DCT = "dct"
    CVT = "cvt"
    IMT = "imt"


class FeatureCategory(StrEnum):
    SAFETY = "safety"
    COMFORT = "comfort"
    INFOTAINMENT = "infotainment"
    OWNERSHIP = "ownership"
    CONVENIENCE = "convenience"


class Make(Base):
    __tablename__ = "make"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    logo_url: Mapped[str | None] = mapped_column(String(500))
    country_of_origin: Mapped[str | None] = mapped_column(String(120))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    models: Mapped[list["Model"]] = relationship(back_populates="make")


class Model(Base):
    __tablename__ = "model"
    __table_args__ = (
        UniqueConstraint("make_id", "name", name="uq_model_make_name"),
        Index("idx_model_body_type", "body_type"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    make_id: Mapped[int] = mapped_column(ForeignKey("make.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    body_type: Mapped[BodyType] = mapped_column(Enum(BodyType), index=True)
    segment: Mapped[str | None] = mapped_column(String(120))
    launched_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_discontinued: Mapped[bool] = mapped_column(Boolean, default=False)

    make: Mapped["Make"] = relationship(back_populates="models")
    variants: Mapped[list["Variant"]] = relationship(back_populates="model")


class Variant(Base):
    __tablename__ = "variant"
    __table_args__ = (
        Index("idx_variant_price", "ex_showroom_price"),
        Index("idx_variant_fuel", "fuel_type"),
        Index("idx_variant_transmission", "transmission"),
        Index("idx_variant_safety", "safety_rating"),
        Index("idx_variant_mileage", "mileage_kmpl"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    model_id: Mapped[int] = mapped_column(ForeignKey("model.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(160))
    ex_showroom_price: Mapped[float] = mapped_column(Float)
    fuel_type: Mapped[FuelType] = mapped_column(Enum(FuelType))
    transmission: Mapped[TransmissionType] = mapped_column(Enum(TransmissionType))
    engine_cc: Mapped[int | None] = mapped_column(Integer)
    max_power_bhp: Mapped[float | None] = mapped_column(Float)
    max_torque_nm: Mapped[float | None] = mapped_column(Float)
    mileage_kmpl: Mapped[float | None] = mapped_column(Float)
    range_km: Mapped[float | None] = mapped_column(Float)
    seating_capacity: Mapped[int] = mapped_column(Integer, default=5)
    ground_clearance_mm: Mapped[int | None] = mapped_column(Integer)
    boot_space_litres: Mapped[int | None] = mapped_column(Integer)
    safety_rating: Mapped[float | None] = mapped_column(Float)
    is_ev: Mapped[bool] = mapped_column(Boolean, default=False)
    is_new: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    model: Mapped["Model"] = relationship(back_populates="variants")
    features: Mapped[list["VariantFeature"]] = relationship(back_populates="variant")
    images: Mapped[list["VariantImage"]] = relationship(back_populates="variant")
    specs: Mapped[list["VariantSpec"]] = relationship(back_populates="variant")
    price_history: Mapped[list["PriceHistory"]] = relationship(back_populates="variant")


class Feature(Base):
    __tablename__ = "feature"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    category: Mapped[FeatureCategory] = mapped_column(Enum(FeatureCategory))

    variants: Mapped[list["VariantFeature"]] = relationship(back_populates="feature")


class VariantFeature(Base):
    __tablename__ = "variant_feature"
    __table_args__ = (UniqueConstraint("variant_id", "feature_id", name="uq_variant_feature"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    variant_id: Mapped[int] = mapped_column(ForeignKey("variant.id", ondelete="CASCADE"), index=True)
    feature_id: Mapped[int] = mapped_column(ForeignKey("feature.id", ondelete="CASCADE"), index=True)

    variant: Mapped["Variant"] = relationship(back_populates="features")
    feature: Mapped["Feature"] = relationship(back_populates="variants")


class VariantImage(Base):
    __tablename__ = "variant_image"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    variant_id: Mapped[int] = mapped_column(ForeignKey("variant.id", ondelete="CASCADE"), index=True)
    url: Mapped[str] = mapped_column(String(800))
    image_type: Mapped[str] = mapped_column(String(20), default="exterior")

    variant: Mapped["Variant"] = relationship(back_populates="images")


class VariantSpec(Base):
    __tablename__ = "variant_spec"
    __table_args__ = (
        UniqueConstraint("variant_id", "spec_group", "spec_key", name="uq_variant_spec"),
        Index("idx_variant_spec_group", "spec_group"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    variant_id: Mapped[int] = mapped_column(ForeignKey("variant.id", ondelete="CASCADE"), index=True)
    spec_group: Mapped[str] = mapped_column(String(80))
    spec_key: Mapped[str] = mapped_column(String(120))
    spec_value: Mapped[str] = mapped_column(String(200))

    variant: Mapped["Variant"] = relationship(back_populates="specs")


class PriceHistory(Base):
    __tablename__ = "price_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    variant_id: Mapped[int] = mapped_column(ForeignKey("variant.id", ondelete="CASCADE"), index=True)
    price: Mapped[float] = mapped_column(Float)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    variant: Mapped["Variant"] = relationship(back_populates="price_history")


class OnRoadPriceRule(Base):
    __tablename__ = "on_road_price_rule"
    __table_args__ = (UniqueConstraint("state_code", name="uq_state_code"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    state_code: Mapped[str] = mapped_column(String(8), index=True)
    rto_pct: Mapped[float] = mapped_column(Float, default=9.0)
    green_tax_flat: Mapped[float] = mapped_column(Float, default=0.0)
    handling_charge_flat: Mapped[float] = mapped_column(Float, default=12000.0)
