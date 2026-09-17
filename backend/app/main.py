from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.models.opportunity import Opportunity
from app.models.student import Student
from app.routes.opportunities import router as opportunities_router
from app.seed import seed


# -----------------------------------
# DATABASE
# -----------------------------------

Base.metadata.create_all(bind=engine)

# Add initial data
seed()


# -----------------------------------
# FASTAPI APPLICATION
# -----------------------------------

app = FastAPI(
    title="SCHOLARA API",
    description="AI-powered student opportunity discovery platform",
    version="2.0.0"
)


# -----------------------------------
# CORS
# -----------------------------------


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------
# HOME
# -----------------------------------

@app.get("/")
def home():
    return {
        "application": "SCHOLARA",
        "status": "running",
        "message": "Opportunity discovery API is ready"
    }


# -----------------------------------
# HEALTH CHECK
# -----------------------------------

@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }


# -----------------------------------
# OPPORTUNITY ROUTES
# -----------------------------------

app.include_router(opportunities_router)