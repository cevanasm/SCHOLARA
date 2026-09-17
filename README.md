# SCHOLARA — Integrated MVP

A complete local working MVP for student internship and scholarship discovery.

## Stack
- React + Vite
- FastAPI
- SQLite + SQLAlchemy
- Axios
- React Router

## Features
- Responsive pastel green/blue interface
- Hamburger menu
- Student profile
- Internship discovery
- Scholarship discovery
- Search
- Profile-based matching
- Eligibility checks
- Skill-gap feedback
- Opportunity details
- Save opportunities
- Application tracker
- Official-source links
- Seed database
- FastAPI Swagger docs

## Start on macOS/Linux

From the SCHOLARA folder:

```bash
bash start_scholara.sh
```

Open:
http://localhost:5173

Backend:
http://127.0.0.1:8000

API docs:
http://127.0.0.1:8000/docs

## Data integrity

This project uses source-backed seed records and official source URLs. It does NOT claim that a static seed database is permanently exhaustive. Opportunity deadlines and listings change.

For production, add scheduled ingestion/verification against official portals and store a `last_verified_at` timestamp and active/expired status for every record.

Official source registry:
- National Scholarship Portal: https://scholarships.gov.in/All-Scholarships
- AICTE National Internship Portal: https://internship.aicte-india.org/

## Deployment

Frontend:
```bash
cd frontend
npm install
npm run build
```

Backend:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

For production use PostgreSQL, HTTPS, environment variables, proper authentication, and scheduled source verification.
