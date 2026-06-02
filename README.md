# CarDekho Replica

Car discovery MVP with a lightweight Python API backend and a React frontend.

The backend treats `data/cars.json` as a small NoSQL-style JSON database. There is no PostgreSQL, Redis, Alembic, Docker, Nginx, or Celery.

## What Is Included

- FastAPI REST APIs backed by `data/cars.json`
- Browse cars with filters
- Car detail pages
- Recommendations
- Side-by-side comparison
- Login page placeholder
- Browser-local shortlist using `localStorage`

## Tech Stack

- Backend: Python, FastAPI, Uvicorn
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand
- Data store: `data/cars.json`

## Backend Setup

Open a terminal from the project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend URLs:

```text
http://127.0.0.1:8000/health
http://127.0.0.1:8000/api/cars
```

## Frontend Setup

Open a second terminal from the project root:

```powershell
npm i
npm run dev:frontend
```

Open:

```text
http://127.0.0.1:5173
```

## API Overview

```text
GET  /api/cars
GET  /api/cars/upcoming
GET  /api/cars/{id}
GET  /api/cars/{id}/similar
GET  /api/cars/{id}/reviews
GET  /api/cars/{id}/on-road-price
POST /api/compare
POST /api/recommendations
```

Example:

```text
GET http://127.0.0.1:8000/api/cars?bodyTypes=suv&limit=12&offset=0
```

## Build

```powershell
npm run build
```

## Data Source

All catalogue data lives in:

```text
data/cars.json
```

To add or edit cars, update `data/cars.json` and restart the backend so the API reloads the catalogue.
