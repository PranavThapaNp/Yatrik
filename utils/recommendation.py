from sqlalchemy.orm import Session
import models

#Popularity score
def popularity_score(dest: models.Destinations) -> float:
    
    views = getattr(dest, "views_count", 0) or 0
    favorites = getattr(dest, "favorites_count", 0) or 0
    searches = getattr(dest,"search_count", 0) or 0
    
    return(
        views * 1.0 +
        favorites * 3.0 +
        searches * 2.0
    )

#Similarity score
def similarity_score(dest_a: models.Destinations, dest_b: models.Destinations) -> float:
    
    score = 0
    
    if dest_a.destination_type == dest_b.destination_type:
        score += 3
    
    if dest_a.category and dest_b.category:
        if dest_a.category == dest_b.category:
            score += 2
    
    if dest_a.location and dest_b.location:
        if dest_a.location == dest_b.location:
            score += 2
    
    return score


#To get popular destinations
def get_popular_destinations(db: Session, limit = 4):
    
    destinations = db.query(models.Destinations).all()
    
    sorted_dest = sorted(
        destinations,
        key=lambda d: popularity_score(d),
        reverse=True
    )
    
    return sorted_dest[:limit]

#To get similar destinations
def get_similar_destinations(db: Session, current_dest: models.Destinations, limit: int = 4):
    
    all_destinations = db.query(models.Destinations).all()
    
    similar = [
        d for d in all_destinations
        if d.id != current_dest.id
    ]
    
    sorted_dest = sorted(
        similar,
        key=lambda d: similarity_score(current_dest, d),
        reverse=True
    )
    
    return sorted_dest[:limit]