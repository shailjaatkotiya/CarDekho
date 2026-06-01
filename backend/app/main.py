from __future__ import annotations

import time
import uuid
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.fastapi import GraphQLRouter

from app.core.config import get_settings
from app.core.database import get_db_session
from app.core.redis import redis_client
from app.domains.alerts.router import router as alerts_router
from app.domains.cars.router import router as cars_router
from app.domains.shortlist.router import router as shortlist_router
from app.domains.users.router import router as users_router
from app.graphql.schema import GraphQLContext, schema

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await redis_client.close()


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_observability_context(request: Request, call_next):
    correlation_id = request.headers.get("x-correlation-id", str(uuid.uuid4()))
    start = time.perf_counter()
    identity = request.headers.get("authorization", request.client.host if request.client else "anon")
    key_scope = "auth" if request.headers.get("authorization") else "public"
    try:
        window_key = f"ratelimit:{key_scope}:{identity}"
        current = await redis_client.incr(window_key)
        if current == 1:
            await redis_client.expire(window_key, 60)
        limit = 1000 if key_scope == "auth" else 100
        if current > limit:
            return JSONResponse(
                status_code=429,
                content={"data": None, "errors": [{"code": "RATE_LIMIT", "message": "Too many requests"}], "meta": {}},
            )
    except Exception:
        pass

    response = await call_next(request)
    duration_ms = round((time.perf_counter() - start) * 1000, 2)
    response.headers["x-correlation-id"] = correlation_id
    response.headers["x-response-time-ms"] = str(duration_ms)
    response.headers["x-content-type-options"] = "nosniff"
    response.headers["x-frame-options"] = "DENY"
    response.headers["content-security-policy"] = "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; script-src 'self' 'unsafe-inline'"
    return response


async def graphql_context() -> GraphQLContext:
    async for session in get_db_session():
        return GraphQLContext(session=session)
    raise RuntimeError("Database session is unavailable")


graphql_app = GraphQLRouter(schema=schema, context_getter=graphql_context)
app.include_router(graphql_app, prefix="/graphql")

app.include_router(cars_router)
app.include_router(shortlist_router)
app.include_router(users_router)
app.include_router(alerts_router)


@app.get("/health")
async def health() -> dict[str, bool]:
    return {"ok": True}


@app.get("/ready")
async def ready(session: AsyncSession = Depends(get_db_session)) -> dict[str, bool]:
    await session.execute(text("SELECT 1"))
    try:
        await redis_client.ping()
    except Exception:
        pass
    return {"ready": True}
