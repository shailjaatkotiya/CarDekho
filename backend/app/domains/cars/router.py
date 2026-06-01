from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.response import envelope
from app.domains.cars.repository import CarsRepository
from app.domains.cars.schemas import CarFilterInput, PaginationInput
from app.domains.cars.service import CarsService

router = APIRouter(prefix="/api/cars", tags=["cars"])


def get_service(session: AsyncSession) -> CarsService:
    return CarsService(CarsRepository(session))


@router.get("")
async def list_cars(
    q: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    body_type: str | None = None,
    fuel_type: str | None = None,
    transmission: str | None = None,
    limit: int = 12,
    offset: int = 0,
    session: AsyncSession = Depends(get_db_session),
):
    car_filter = CarFilterInput(
        q=q,
        min_price=min_price,
        max_price=max_price,
        body_type=body_type,
        fuel_type=fuel_type,
        transmission=transmission,
    )
    pagination = PaginationInput(limit=limit, offset=offset)
    service = get_service(session)
    cars, total = await service.list_cars(car_filter=car_filter, pagination=pagination)
    return envelope(data=cars, meta={"total": total, "limit": limit, "offset": offset})


@router.get("/{variant_id}")
async def get_car(variant_id: int, session: AsyncSession = Depends(get_db_session)):
    service = get_service(session)
    car = await service.get_variant(variant_id)
    if not car:
        return envelope(data=None, errors=[{"code": "NOT_FOUND", "message": "Variant not found"}], meta={})
    return envelope(data=car, meta={})
