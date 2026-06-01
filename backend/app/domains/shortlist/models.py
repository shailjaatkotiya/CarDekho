from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Shortlist(Base):
    __tablename__ = "shortlist"
    __table_args__ = (UniqueConstraint("user_id", "variant_id", name="uq_shortlist_user_variant"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    guest_token: Mapped[str | None] = mapped_column(String(120), index=True)
    variant_id: Mapped[int] = mapped_column(ForeignKey("variant.id", ondelete="CASCADE"), index=True)
    notes: Mapped[str | None] = mapped_column(Text)
    share_token: Mapped[str | None] = mapped_column(String(120), index=True)
    saved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
