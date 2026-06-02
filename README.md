# CarDekho Replica Platform

React + FastAPI car discovery MVP with browse, compare, recommendations, car details, and login-gated shortlist flow.

## What I Built
I built a CarDekho-style car discovery MVP: a React frontend with browsing, filters, car cards, car detail pages, comparison, discovery recommendations, shortlist/login flow, and supporting UI like EMI/on-road price tools.

The app is backed by a structured FastAPI/GraphQL architecture with dummy/local car data so the frontend can behave like a real product without needing a fully production-ready backend yet. The goal was to show the core buying journey clearly: search cars, inspect options, compare models, and move toward saving/shortlisting.

I also fixed two specific broken flows:

The Compare feature now carries selected car IDs into /compare?ids=..., persists the selection locally, and handles loading errors better.
The Shortlist button now redirects users to a real /login page instead of trying to save immediately.

#### Why I Built It This Way
I prioritized the customer-facing car buying experience first because this app is meant to feel like a usable CarDekho-inspired product, not just a backend demo.

##### The important product flows are:

- Browse cars by preference
- Compare 2-4 cars side by side
- View details before deciding
- Save/shortlist only after login
- Keep backend data replaceable later with real APIs/database
- So the app uses dummy data and GraphQL-style structure now, but the modules are shaped so real auth, database persistence, reviews, alerts, and pricing can be plugged in later.

## What I Deliberately Cut
I deliberately cut full production features that would slow down the MVP:

- Real authentication and signup persistence
- Real user accounts and saved shortlist ownership
- Payment, dealer contact, and booking workflows
- Full admin panel for adding/editing cars
- Live CarDekho scraping or live third-party data
- Production-grade comparison PDF export
- Complete backend deployment and monitoring
- Real image/content moderation or data validation pipeline
- I kept the MVP focused on proving the product journey first: discovery, browse, compare, detail, and login-gated shortlist.

### Tech Stack

- `frontend/`: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Apollo Client, Zustand
- `backend/`: FastAPI, Strawberry GraphQL, SQLAlchemy async, Alembic, PostgreSQL, Redis

## What did you delegate to AI tools vs. do manually? Where did the tools help most?Where did they get in the way?

- I delegated the entire production of the application including the product design and system design of the product to ensure nothing is missed from my end. Tools helped the most to design the entire product and create perfect prompts as well to generate the desired output. Some areas where tools lack are since entire application was created in one go with single prompt generation there are certain features and functionalities that are not upto the mark or not created well which can be refactored by re prompting the tools. 

## If you had another 4 hours, what would you add?

If given more time I had some of the pretty cool features in my mind. 
- For each cars displayed in the view, I would generate 3D model of the car and load there with features like 3D view of infotainment system. A 3D walkthrough of the car to let users understand how the product feels. 

- Apart from that I would add insurance details with which facilities will be provided on what selection for users to understand and make the decision to by the car easily

- I also wanted to add a comparison feature of different models of same particular car for user to understand what comes in the price gap they show when you are purchasing the base model vs top model.

## Quick start

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
