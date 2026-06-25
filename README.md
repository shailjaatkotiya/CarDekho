# CarDekho Replica

Car discovery MVP with a lightweight Python API backend and a React frontend.

The backend treats `data/cars.json` as a small NoSQL-style JSON database. There is no PostgreSQL, Redis, Alembic, Docker, Nginx, or Celery.

## Screenshots

### Home
![Home page](docs/screenshots/home.png)

### Car Detail
![Car detail page](docs/screenshots/car-detail.png)

### Compare
![Compare cars](docs/screenshots/compare.png)

## What Is Included

- FastAPI REST APIs backed by `data/cars.json`
- Browse cars with filters
- Car detail pages
- Recommendations
- Side-by-side comparison
- Login page placeholder
- Browser-local shortlist using `localStorage`

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

## What did you delegate to AI tools vs. do manually? Where did the tools help most?Where did they get in the way?

- I delegated the entire production of the application including the product design and system design of the product to ensure nothing is missed from my end. Tools helped the most to design the entire product and create perfect prompts as well to generate the desired output. Some areas where tools lack are since entire application was created in one go with single prompt generation there are certain features and functionalities that are not upto the mark or not created well which can be refactored by re prompting the tools. 

## If you had another 4 hours, what would you add?

If given more time I had some of the pretty cool features in my mind. 
- For each cars displayed in the view, I would generate 3D model of the car and load there with features like 3D view of infotainment system. A 3D walkthrough of the car to let users understand how the product feels. 

- Apart from that I would add insurance details with which facilities will be provided on what selection for users to understand and make the decision to by the car easily

- I also wanted to add a comparison feature of different models of same particular car for user to understand what comes in the price gap they show when you are purchasing the base model vs top model.

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
