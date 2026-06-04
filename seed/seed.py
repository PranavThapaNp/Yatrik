from database import SessionLocal
import models
import json
import os
from sqlalchemy.dialects.postgresql import insert

db = SessionLocal()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
json_path = os.path.join(BASE_DIR, "seed_data", "destinations.json")

with open(json_path, "r", encoding="utf-8") as f:  #Opens Json file ani converts it into py list of dict
    data = json.load(f)


for item in data:

    # Upsert Logic
    #Prepares insert query
    stmt = insert(models.Destinations).values(
        name=item["name"],
        slug=item["slug"],
        destination_type=item["destination_type"],
        location=item["location"],
        short_description=item["short_description"],
        category=item["category"]
    )

    #Slug pailai xa vaney update natra insert
    stmt = stmt.on_conflict_do_update(
        index_elements=["slug"],
        set_={
            "name": stmt.excluded.name,
            "destination_type": stmt.excluded.destination_type,
            "location": stmt.excluded.location,
            "short_description": stmt.excluded.short_description,
            "category": stmt.excluded.category,
        }
    )

    db.execute(stmt)
    db.commit()

    #Fetch Updated Destinations for images
    destination = db.query(models.Destinations).filter_by(
        slug=item["slug"]
    ).first()

    #Delete old images
    db.query(models.DestinationImage).filter_by(
        destination_id=destination.id
    ).delete()

    #Insert new images
    for img in item["images"]:
        db.add(models.DestinationImage(
            destination_id=destination.id,
            image_url=img
        ))

    db.commit()


db.close()