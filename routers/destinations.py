from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from dependencies import get_db
from sqlalchemy import or_, case

router = APIRouter(
    prefix="/destinations",
    tags=["Destinations"]
    )

#Explore Destinations Page ko lagi paila

@router.get("/", response_model = list[schemas.DestinationCard])
def get_destinations(
    destination_type: str | None = None,
    search: str | None = None,
    db: Session =Depends(get_db)):
    
    query = db.query(models.Destinations)
    
    #Filter by destination type
    if destination_type:
        query = query.filter(
            models.Destinations.destination_type == destination_type
        )
    
    #Search funtion
    if search:
        terms = search.lower().split()
        
        match_conditions = []
        
        for term in terms:
            pattern = f"%{term}%"
        
            match_conditions.append(
                or_(
                    models.Destinations.name.ilike(pattern),
                    models.Destinations.short_description.ilike(pattern),
                    models.Destinations.location.ilike(pattern),
                    models.Destinations.category.ilike(pattern),
                )   
            )
    
        #Flexible Matching
        query = query.filter(*match_conditions)
    
        #Ranking by relevance score
        score = (
            case((models.Destinations.name.ilike(f"%{search}%"), 10), else_=0) +
            case((models.Destinations.short_description.ilike(f"%{search}%"), 5), else_=0) +
            case((models.Destinations.location.ilike(f"%{search}%"), 3), else_=0) +
            case((models.Destinations.category.ilike(f"%{search}%"), 2), else_=0)
        )
    
        query = query.add_columns(score.label("relevance_score"))
        query = query.order_by(score.desc())
        
        results = query.all()
        
        output = []
        
        for destination, _ in results:
            cover_image = destination.images[0].image_url if destination.images else None
            
            output.append({
                "id": destination.id,
                "name": destination.name,
                "slug": destination.slug,
                "destination_type": destination.destination_type,
                "location": destination.location,
                "short_description": destination.short_description,
                "category": destination.category,
                "cover_image": cover_image
            })
            
        return output
    
    #Default(Search nagarda)
    destinations = query.all()

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