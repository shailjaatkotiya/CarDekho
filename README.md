# CarDekho Replica Platform

React + FastAPI car discovery MVP with browse, compare, recommendations, car details, and login-gated shortlist flow.

## Tech Stack

- `frontend/`: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Apollo Client, Zustand
- `backend/`: FastAPI, Strawberry GraphQL, SQLAlchemy async, Alembic, PostgreSQL, Redis

## Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL running locally
- Redis running locally

Create a local PostgreSQL database/user that matches `.env.example`, or update `DATABASE_URL` with your own credentials.

## Environment Setup

From the project root:

```powershell
Copy-Item .env.example backend\.env
```

Default backend URLs:

```env
DATABASE_URL=postgresql+asyncpg://cardekho:cardekho@localhost:5432/cardekho
REDIS_URL=redis://localhost:6379/0
CORS_ORIGINS=http://localhost:5173
```

## Run Backend

Open a terminal from the project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend endpoints:

- Health: `http://127.0.0.1:8000/health`
- GraphQL: `http://127.0.0.1:8000/graphql`

## Run Frontend

Open a second terminal from the project root:

```powershell
cd frontend
npm i
npm run dev
```

Open the app:

```text
http://localhost:5173
```

## Useful Commands

Frontend:

```powershell
cd frontend
npm run build
npm run test
```

Backend:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pytest
```

## Architecture Notes

- GraphQL is the primary read path for cars, search, recommendations, compare, reviews, and shortlist.
- REST is used for auth, alerts, and shortlist side-effect endpoints.
- Discovery recommendations are rule-based and explainable.
- Backend domains are split by feature so the app can scale without one giant service file.
