from pydantic import BaseModel, Field


class OnRoadPriceResponse(BaseModel):
    ex_showroom_price: float
    rto_amount: float
    green_tax: float
    handling_charge: float
    total_on_road_price: float


class EMIInput(BaseModel):
    principal: float = Field(ge=10000)
    annual_rate: float = Field(ge=1.0, le=30.0)
    tenure_months: int = Field(ge=6, le=120)
