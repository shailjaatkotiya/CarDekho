# CarDekho Replica Platform (Scalable MVP)

Production-oriented monorepo with:

- `frontend/`: React 18 + TypeScript + Vite + Tailwind + TanStack Query + Apollo + Zustand
- `backend/`: FastAPI + Strawberry GraphQL + SQLAlchemy async + Alembic + Redis + Celery
- `docker-compose.yml`: local stack with Postgres, Redis, backend, worker, frontend, Nginx

## Quick start

1. Copy environment values:

```bash
cp .env.example .env
```

2. Start the full platform:

```bash
docker compose up --build
```

3. Open:

- Product app: `http://localhost:8080`
- Backend health: `http://localhost:8000/health`
- GraphQL endpoint: `http://localhost:8000/graphql`

## Monorepo scripts

```bash
npm run dev:frontend
npm run build:frontend
npm run docker:up
npm run docker:down
```

## Architecture notes

- GraphQL is the primary read path (`cars`, `search`, `recommend`, `compare`, `reviews`, `shortlist`)
- REST is used for side-effect operations (`auth`, `alerts`, `shortlist`, `bookings`)
- Discovery recommendations are rule-based and explainable, with weighted scoring
- Redis is wired for caching and can be expanded with TTL keys per query pattern
- Backend keeps clean domain folders so features scale by module, not by giant service files
