from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Review(Base):
    __tablename__ = "review"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), index=True)
    variant_id: Mapped[int] = mapped_column(ForeignKey("variant.id", ondelete="CASCADE"), index=True)
    rating_overall: Mapped[float] = mapped_column(Float, default=0.0)
    rating_value: Mapped[float] = mapped_column(Float, default=0.0)
    rating_comfort: Mapped[float] = mapped_column(Float, default=0.0)
    rating_performance: Mapped[float] = mapped_column(Float, default=0.0)
    rating_mileage: Mapped[float] = mapped_column(Float, default=0.0)
    rating_features: Mapped[float] = mapped_column(Float, default=0.0)
    rating_service: Mapped[float] = mapped_column(Float, default=0.0)
    body: Mapped[str] = mapped_column(Text, default="")
    ownership_months: Mapped[int] = mapped_column(Integer, default=0)
    upvotes: Mapped[int] = mapped_column(Integer, default=0)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
