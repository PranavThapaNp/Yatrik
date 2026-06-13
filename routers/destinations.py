from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from dependencies import get_db
from sqlalchemy import or_, case
from utils.recommendation import get_popular_destinations, get_similar_destinations


router = APIRouter(
    prefix="/destinations",
    tags=["Destinations"]
    )

#Explore Destinations Page ko lagi paila
@router.get("/", response_model=list[schemas.DestinationCard])
def get_destinations(
    destination_type: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(models.Destinations)

    # FILTER
    if destination_type:
        query = query.filter(
            models.Destinations.destination_type == destination_type.strip().lower()
        )

    # SEARCH
    if search:
        terms = search.lower().split()

        search_filter = or_(
            *[
                or_(
                    models.Destinations.name.ilike(f"%{term}%"),
                    models.Destinations.short_description.ilike(f"%{term}%"),
                    models.Destinations.location.ilike(f"%{term}%"),
                    models.Destinations.category.ilike(f"%{term}%"),
                )
                for term in terms
            ]
        )

        query = query.filter(search_filter)

        score = (
            case((models.Destinations.name.ilike(f"%{search}%"), 10), else_=0) +
            case((models.Destinations.short_description.ilike(f"%{search}%"), 5), else_=0) +
            case((models.Destinations.location.ilike(f"%{search}%"), 3), else_=0) +
            case((models.Destinations.category.ilike(f"%{search}%"), 2), else_=0)
        )

        query = query.add_columns(score.label("relevance_score")).order_by(score.desc())

        results = query.all()

        return [
            {
                "id": d.id,
                "name": d.name,
                "slug": d.slug,
                "destination_type": d.destination_type,
                "location": d.location,
                "short_description": d.short_description,
                "category": d.category,
                "cover_image": d.images[0].image_url if d.images else None,
            }
            for d, _ in results
        ]

    # DEFAULT
    destinations = query.all()

    return [
        {
            "id": d.id,
            "name": d.name,
            "slug": d.slug,
            "destination_type": d.destination_type,
            "location": d.location,
            "short_description": d.short_description,
            "category": d.category,
            "cover_image": d.images[0].image_url if d.images else None,
        }
        for d in destinations
    ]


#Popular Treks endpoint
@router.get("/popular", response_model=list[schemas.DestinationCard])
def popular_destinations(db: Session = Depends(get_db)):

    destinations = get_popular_destinations(db, limit=4)

    result = []

    for destination in destinations:
        cover_image = destination.images[0].image_url if destination.images else None

        result.append({
            "id": destination.id,
            "name": destination.name,
            "slug": destination.slug,
            "destination_type": destination.destination_type,
            "location": destination.location,
            "short_description": destination.short_description,
            "category": destination.category,
            "cover_image": cover_image
        })

    return result

#Similar Treks endpoint
@router.get("/{slug}/similar", response_model=list[schemas.DestinationCard])
def similar_destinations(slug: str, db: Session = Depends(get_db)):

    current = db.query(models.Destinations).filter(
        models.Destinations.slug == slug
    ).first()

    if not current:
        raise HTTPException(status_code=404, detail="Destination not found")

    similar = get_similar_destinations(db, current, limit=4)

    result = []

    for destination in similar:
        cover_image = destination.images[0].image_url if destination.images else None

        result.append({
            "id": destination.id,
            "name": destination.name,
            "slug": destination.slug,
            "destination_type": destination.destination_type,
            "location": destination.location,
            "short_description": destination.short_description,
            "category": destination.category,
            "cover_image": cover_image
        })

    return result

#Destination Details

@router.get("/{slug}", response_model=schemas.DestinationOut)
def get_destination_detail(slug: str, db: Session = Depends(get_db)):
    
    destination = db.query(models.Destinations).filter(
        models.Destinations.slug == slug
    ).first()
    
    if not destination:
        raise HTTPException(
            status_code=404,
            detail="Destination not found"
        )
    
    return destination