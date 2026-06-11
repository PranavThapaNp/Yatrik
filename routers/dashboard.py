from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
from dependencies import get_db
from auth.oauth2 import get_current_user

from utils.recommendation import (
    get_popular_destinations,
    get_similar_destinations
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# -----------------------------
# Helper: format destination
# -----------------------------
def format_destination(dest):
    return {
        "id": dest.id,
        "name": dest.name,
        "slug": dest.slug,
        "destination_type": dest.destination_type,
        "location": dest.location,
        "short_description": dest.short_description,
        "cover_image": dest.images[0].image_url if dest.images else None
    }


# -----------------------------
# DASHBOARD API
# -----------------------------
@router.get("/")
def get_dashboard(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    # -------------------------
    # 1. GET SAVED DESTINATIONS
    # -------------------------
    saved_query = db.query(models.SavedDestination).filter(
        models.SavedDestination.user_id == user.id
    ).all()

    saved_destinations = [
        item.destination for item in saved_query if item.destination
    ]

    saved_count = len(saved_destinations)

    saved_response = [
        format_destination(dest) for dest in saved_destinations
    ]

    # -------------------------
    # 2. RECOMMENDATIONS
    # -------------------------
    if saved_destinations:

        # Use last saved destination for similarity
        current_dest = saved_destinations[-1]

        recommended = get_similar_destinations(
            db,
            current_dest=current_dest,
            limit=6
        )

    else:
        recommended = get_popular_destinations(db, limit=6)

    recommended_response = [
        {
            **format_destination(dest),
            "reason": "Based on your interests"
            if saved_destinations else "Popular destination"
        }
        for dest in recommended
    ]

    # -------------------------
    # 3. USER OVERVIEW
    # -------------------------
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "saved_count": saved_count
        },
        "saved_destinations": saved_response,
        "recommended_destinations": recommended_response
    }