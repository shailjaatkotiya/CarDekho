from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.response import envelope
from app.domains.users.auth import AuthService

router = APIRouter(prefix="/api/auth", tags=["auth"])


class RegisterPayload(BaseModel):
    email: EmailStr
    password: str


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
async def register(payload: RegisterPayload, session: AsyncSession = Depends(get_db_session)):
    auth = AuthService(session)
    user = await auth.register(email=payload.email, password=payload.password)
    return envelope(data={"id": str(user.id), "email": user.email}, meta={})


@router.post("/login")
async def login(payload: LoginPayload, session: AsyncSession = Depends(get_db_session)):
    auth = AuthService(session)
    token_payload = await auth.login(email=payload.email, password=payload.password)
    if not token_payload:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return envelope(data=token_payload, meta={})
