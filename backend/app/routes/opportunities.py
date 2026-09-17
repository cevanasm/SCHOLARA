from typing import Optional 
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.opportunity import Opportunity
from app.services.matching import match_opportunity


router = APIRouter(
    prefix="/api/opportunities",
    tags=["Opportunities"]
)


@router.get("")
def get_opportunities(
    kind: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Opportunity)

    if kind:
        query = query.filter(Opportunity.kind == kind)

    opportunities = query.all()

    if q:
        search = q.lower()

        opportunities = [
            opportunity
            for opportunity in opportunities
            if search in (
                f"{opportunity.title} "
                f"{opportunity.organization} "
                f"{opportunity.field} "
                f"{opportunity.location} "
                f"{opportunity.state} "
                f"{opportunity.country}"
            ).lower()
        ]

    return opportunities


@router.get("/{opportunity_id}")
def get_opportunity(
    opportunity_id: int,
    db: Session = Depends(get_db)
):
    opportunity = (
        db.query(Opportunity)
        .filter(Opportunity.id == opportunity_id)
        .first()
    )

    if not opportunity:
        return {
            "error": "Opportunity not found"
        }

    return opportunity


@router.post("/match")
def match_opportunities(
    student: dict,
    kind: str = Query("internship"),
    db: Session = Depends(get_db)
):
    opportunities = (
        db.query(Opportunity)
        .filter(Opportunity.kind == kind)
        .all()
    )

    results = []

    for opportunity in opportunities:

        opportunity_data = {
            column.name: getattr(opportunity, column.name)
            for column in opportunity.__table__.columns
        }

        result = match_opportunity(
            student,
            opportunity_data
        )

        results.append({
            "opportunity": opportunity_data,
            "match": result
        })

    results.sort(
        key=lambda item: item["match"]["score"],
        reverse=True
    )

    return {
        "student": student,
        "kind": kind,
        "total": len(results),

        "eligible": [
            item for item in results
            if item["match"]["status"] == "Eligible"
        ],

        "close_matches": [
            item for item in results
            if item["match"]["status"] == "Close match"
        ],

        "not_currently_eligible": [
            item for item in results
            if item["match"]["status"] == "Not currently eligible"
        ],

        "results": results
    }