from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
from dependencies import get_db
from  auth.oauth2 import get_current_user

router = APIRouter(
    prefix="/saved",
    tags=["Saved Destinations"]
)

#Save garna
@router.post("/{destination_id}")
def save_destination(
    destination_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    # check destination exists
    destination = db.query(models.Destinations).filter(
        models.Destinations.id == destination_id
    ).first()

    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")

    # check already saved
    existing = db.query(models.SavedDestination).filter(
        models.SavedDestination.user_id == current_user.id,
        models.SavedDestination.destination_id == destination_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already saved")

    saved = models.SavedDestination(
        user_id=current_user.id,
        destination_id=destination_id
    )

    db.add(saved)
    db.commit()

    return {"message": "Destination saved successfully"}

#Save bata hatauna
@router.delete("/{destination_id}")
def remove_saved_destination(
    destination_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    saved = db.query(models.SavedDestination).filter(
        models.SavedDestination.user_id == current_user.id,
        models.SavedDestination.destination_id == destination_id
    ).first()

    if not saved:
        raise HTTPException(status_code=404, detail="Not saved")

    db.delete(saved)
    db.commit()

    return {"message": "Removed from saved"}

#To get saved
@router.get("/")
def get_saved_destinations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    saved_items = db.query(models.SavedDestination).filter(
        models.SavedDestination.user_id == current_user.id
    ).all()

    result = []

    for item in saved_items:
        dest = item.destination

        cover_image = dest.images[0].image_url if dest.images else None

        result.append({
            "id": dest.id,
            "name": dest.name,
            "slug": dest.slug,
            "destination_type": dest.destination_type,
            "location": dest.location,
            "short_description": dest.short_description,
            "category": dest.category,
            "cover_image": cover_image
        })

    return result