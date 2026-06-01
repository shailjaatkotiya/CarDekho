"""initial schema

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-06-01
"""

from alembic import op
import sqlalchemy as sa


revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "make",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False, unique=True),
        sa.Column("logo_url", sa.String(length=500), nullable=True),
        sa.Column("country_of_origin", sa.String(length=120), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "user",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=20), nullable=True),
        sa.Column("password_hash", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_user_email", "user", ["email"], unique=True)
    op.create_index("ix_user_phone", "user", ["phone"], unique=True)

    op.create_table(
        "model",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("make_id", sa.Integer(), sa.ForeignKey("make.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("body_type", sa.String(length=20), nullable=False),
        sa.Column("segment", sa.String(length=120), nullable=True),
        sa.Column("launched_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_discontinued", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.UniqueConstraint("make_id", "name", name="uq_model_make_name"),
    )
    op.create_index("idx_model_body_type", "model", ["body_type"], unique=False)

    op.create_table(
        "variant",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("model_id", sa.Integer(), sa.ForeignKey("model.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("ex_showroom_price", sa.Float(), nullable=False),
        sa.Column("fuel_type", sa.String(length=20), nullable=False),
        sa.Column("transmission", sa.String(length=20), nullable=False),
        sa.Column("engine_cc", sa.Integer(), nullable=True),
        sa.Column("max_power_bhp", sa.Float(), nullable=True),
        sa.Column("max_torque_nm", sa.Float(), nullable=True),
        sa.Column("mileage_kmpl", sa.Float(), nullable=True),
        sa.Column("range_km", sa.Float(), nullable=True),
        sa.Column("seating_capacity", sa.Integer(), nullable=False, server_default="5"),
        sa.Column("ground_clearance_mm", sa.Integer(), nullable=True),
        sa.Column("boot_space_litres", sa.Integer(), nullable=True),
        sa.Column("safety_rating", sa.Float(), nullable=True),
        sa.Column("is_ev", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_new", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("idx_variant_price", "variant", ["ex_showroom_price"], unique=False)
    op.create_index("idx_variant_fuel", "variant", ["fuel_type"], unique=False)
    op.create_index("idx_variant_transmission", "variant", ["transmission"], unique=False)
    op.create_index("idx_variant_safety", "variant", ["safety_rating"], unique=False)
    op.create_index("idx_variant_mileage", "variant", ["mileage_kmpl"], unique=False)

    op.create_table(
        "feature",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=200), nullable=False, unique=True),
        sa.Column("category", sa.String(length=30), nullable=False),
    )
    op.create_table(
        "variant_feature",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("variant_id", sa.Integer(), sa.ForeignKey("variant.id", ondelete="CASCADE"), nullable=False),
        sa.Column("feature_id", sa.Integer(), sa.ForeignKey("feature.id", ondelete="CASCADE"), nullable=False),
        sa.UniqueConstraint("variant_id", "feature_id", name="uq_variant_feature"),
    )
    op.create_table(
        "variant_image",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("variant_id", sa.Integer(), sa.ForeignKey("variant.id", ondelete="CASCADE"), nullable=False),
        sa.Column("url", sa.String(length=800), nullable=False),
        sa.Column("image_type", sa.String(length=20), nullable=False, server_default="exterior"),
    )
    op.create_table(
        "variant_spec",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("variant_id", sa.Integer(), sa.ForeignKey("variant.id", ondelete="CASCADE"), nullable=False),
        sa.Column("spec_group", sa.String(length=80), nullable=False),
        sa.Column("spec_key", sa.String(length=120), nullable=False),
        sa.Column("spec_value", sa.String(length=200), nullable=False),
        sa.UniqueConstraint("variant_id", "spec_group", "spec_key", name="uq_variant_spec"),
    )

    op.create_table(
        "price_history",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("variant_id", sa.Integer(), sa.ForeignKey("variant.id", ondelete="CASCADE"), nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("recorded_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "on_road_price_rule",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("state_code", sa.String(length=8), nullable=False),
        sa.Column("rto_pct", sa.Float(), nullable=False),
        sa.Column("green_tax_flat", sa.Float(), nullable=False),
        sa.Column("handling_charge_flat", sa.Float(), nullable=False),
        sa.UniqueConstraint("state_code", name="uq_state_code"),
    )

    op.create_table(
        "shortlist",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("user.id", ondelete="CASCADE"), nullable=True),
        sa.Column("guest_token", sa.String(length=120), nullable=True),
        sa.Column("variant_id", sa.Integer(), sa.ForeignKey("variant.id", ondelete="CASCADE"), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("share_token", sa.String(length=120), nullable=True),
        sa.Column("saved_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "variant_id", name="uq_shortlist_user_variant"),
    )

    op.create_table(
        "review",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("user.id", ondelete="SET NULL"), nullable=True),
        sa.Column("variant_id", sa.Integer(), sa.ForeignKey("variant.id", ondelete="CASCADE"), nullable=False),
        sa.Column("rating_overall", sa.Float(), nullable=False, server_default="0"),
        sa.Column("rating_value", sa.Float(), nullable=False, server_default="0"),
        sa.Column("rating_comfort", sa.Float(), nullable=False, server_default="0"),
        sa.Column("rating_performance", sa.Float(), nullable=False, server_default="0"),
        sa.Column("rating_mileage", sa.Float(), nullable=False, server_default="0"),
        sa.Column("rating_features", sa.Float(), nullable=False, server_default="0"),
        sa.Column("rating_service", sa.Float(), nullable=False, server_default="0"),
        sa.Column("body", sa.Text(), nullable=False, server_default=""),
        sa.Column("ownership_months", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("upvotes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "alert",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("user.id", ondelete="CASCADE"), nullable=True),
        sa.Column("alert_type", sa.String(length=32), nullable=False),
        sa.Column("target_id", sa.Integer(), nullable=True),
        sa.Column("threshold_price", sa.Float(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("last_triggered_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("alert")
    op.drop_table("review")
    op.drop_table("shortlist")
    op.drop_table("on_road_price_rule")
    op.drop_table("price_history")
    op.drop_table("variant_spec")
    op.drop_table("variant_image")
    op.drop_table("variant_feature")
    op.drop_table("feature")
    op.drop_index("idx_variant_mileage", table_name="variant")
    op.drop_index("idx_variant_safety", table_name="variant")
    op.drop_index("idx_variant_transmission", table_name="variant")
    op.drop_index("idx_variant_fuel", table_name="variant")
    op.drop_index("idx_variant_price", table_name="variant")
    op.drop_table("variant")
    op.drop_index("idx_model_body_type", table_name="model")
    op.drop_table("model")
    op.drop_index("ix_user_phone", table_name="user")
    op.drop_index("ix_user_email", table_name="user")
    op.drop_table("user")
    op.drop_table("make")
