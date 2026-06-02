# CarDekho Replica Platform (Scalable MVP)

Production-oriented monorepo with:

- `frontend/`: React 18 + TypeScript + Vite + Tailwind + TanStack Query + Apollo + Zustand
- `backend/`: FastAPI + Strawberry GraphQL + SQLAlchemy async + Alembic + Redis + Celery
- `docker-compose.yml`: local stack with Postgres, Redis, backend, worker, frontend, Nginx

## What I Built
I built a CarDekho-style car discovery MVP: a React frontend with browsing, filters, car cards, car detail pages, comparison, discovery recommendations, shortlist/login flow, and supporting UI like EMI/on-road price tools.

The app is backed by a structured FastAPI/GraphQL architecture with dummy/local car data so the frontend can behave like a real product without needing a fully production-ready backend yet. The goal was to show the core buying journey clearly: search cars, inspect options, compare models, and move toward saving/shortlisting.

I also fixed two specific broken flows:

The Compare feature now carries selected car IDs into /compare?ids=..., persists the selection locally, and handles loading errors better.
The Shortlist button now redirects users to a real /login page instead of trying to save immediately.
Why I Built It This Way
I prioritized the customer-facing car buying experience first because this app is meant to feel like a usable CarDekho-inspired product, not just a backend demo.

##### The important product flows are:

Browse cars by preference
Compare 2-4 cars side by side
View details before deciding
Save/shortlist only after login
Keep backend data replaceable later with real APIs/database
So the app uses dummy data and GraphQL-style structure now, but the modules are shaped so real auth, database persistence, reviews, alerts, and pricing can be plugged in later.

### What I Deliberately Cut
I deliberately cut full production features that would slow down the MVP:

Real authentication and signup persistence
Real user accounts and saved shortlist ownership
Payment, dealer contact, and booking workflows
Full admin panel for adding/editing cars
Live CarDekho scraping or live third-party data
Production-grade comparison PDF export
Complete backend deployment and monitoring
Real image/content moderation or data validation pipeline
I kept the MVP focused on proving the product journey first: discovery, browse, compare, detail, and login-gated shortlist.

## What’s your tech stack and why did you pick it?
Frontend:

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Apollo Client
- Zustand

Backend:

- FastAPI
- Strawberry GraphQL
- SQLAlchemy async
- Alembic
- PostgreSQL
- Redis
- Celery
- Data/API:

- GraphQL for main read flows: cars, search, recommendations, compare, reviews, shortlist
- REST for some side-effect flows: auth, alerts, shortlist, bookings
- Local/dummy car JSON used for MVP data seeding

Dev/Infra:

- Docker Compose
- Nginx
- Node/npm workspace
- Python virtual environment / requirements
- Vite dev server for frontend
- FastAPI server for backend

## What did you delegate to AI tools vs. do manually? Where did the tools help most?Where did they get in the way?

- I delegated the entire production of the application including the product design and system design of the product to ensure nothing is missed from my end. Tools helped the most to design the entire product and create perfect prompts as well to generate the desired output. Some areas where tools lack are since entire application was created in one go with single prompt generation there are certain features and functionalities that are not upto the mark or not created well which can be refactored by re prompting the tools. 

## If you had another 4 hours, what would you add?

If given more time I had some of the pretty cool features in my mind. 
- For each cars displayed in the view, I would generate 3D model of the car and load there with features like 3D view of infotainment system. A 3D walkthrough of the car to let users understand how the product feels. 

- Apart from that I would add insurance details with which facilities will be provided on what selection for users to understand and make the decision to by the car easily

- I also wanted to add a comparison feature of different models of same particular car for user to understand what comes in the price gap they show when you are purchasing the base model vs top model.

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
