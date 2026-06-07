from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from dependencies import get_db
from utils.cache import create_cache_key, redis_client
import json
import logging
import re
import os

from data.trek_routes import TREK_ROUTES
from utils.budget import calculate_budget

from groq import Groq

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/itinerary",
    tags=["Itinerary"]
)

CACHE_TTL = 60 * 60 * 24  # 1 day

#Grok client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


@router.post("/generate", response_model=schemas.ItineraryResponse)
def generate_itinerary(
    request: schemas.ItineraryRequest,
    db: Session = Depends(get_db)
):

    #Destination fetch garna
    destination = db.query(models.Destinations).filter(
        models.Destinations.slug == request.destination_slug
    ).first()

    if not destination:
        raise HTTPException(
            status_code=404,
            detail="Destination not found"
        )
    
    #Routes
    route = TREK_ROUTES.get(request.destination_slug)

    is_trek = destination.destination_type == "trek"

    if is_trek:
        if not route:
            raise HTTPException(
                status_code=400,
                detail="Trek route not found for this destination"
            )

        route_text = "\n".join(route)
    else:
        route_text = f"""
    City-based travel (no trekking route).

    Focus on sightseeing, culture, food, and attractions in {destination.name}.
    """
    
    #Days validation
    if request.days < destination.min_days:
        raise HTTPException(
            status_code=400,
            detail=f"{destination.name} requires at least {destination.min_days} days"
        )

    warning = None

    if destination.recommended_days and request.days < destination.recommended_days:
        warning = (
            f"For best experience, {destination.name} is recommended for "
            f"{destination.recommended_days} days."
        )
    
    #Budget
    budget = calculate_budget(
        request.days,
        request.travel_style,
        destination.destination_type
    )

    #Cache key
    cache_key = f"{request.destination_slug}:{request.days}:{request.travel_style}:{destination.destination_type}"

    #Cache check garne pailai xa ki nai vanera, xaina vaney matra ai use hunxa
    try:
        cached_result = redis_client.get(cache_key)
    except Exception as e:
        logger.warning(f"Redis error: {e}")
        cached_result = None

    if cached_result:
        logger.info(f"CACHE HIT: {cache_key}")
        try:
            return json.loads(cached_result)
        except Exception:
            redis_client.delete(cache_key)

    logger.info(f"CACHE MISS: {cache_key}")

    

    #Yo AI prompt pass hunxa strict json result ko lagi
    prompt = f"""
You are a professional Nepal travel itinerary planner.

You are NOT allowed to:
- change route order
- add new locations
- estimate budget
- change number of days

You ONLY generate:
- daily activities
- timing schedule
- travel tips

---

DESTINATION:
{destination.name}

TRAVEL CONTEXT:
{route_text}

DAYS:
{request.days}

TRAVEL STYLE:
{request.travel_style}

---

RULES:
- If travel context is a route (trek), follow order sequentially
- If city-based, create logical sightseeing flow
- Do not invent new locations
- No skipping locations
- No adding new places
- Use realistic trekking pacing
- Keep Nepal trekking conditions in mind

---

OUTPUT FORMAT (STRICT JSON ONLY):

{{
  "itinerary": [
    {{
      "day": 1,
      "location": "",
      "title": "",
      "schedule": [
        {{"time": "Morning", "activity": ""}},
        {{"time": "Afternoon", "activity": ""}},
        {{"time": "Evening", "activity": ""}}
      ]
    }}
  ],
  "travel_tips": []
}}
"""

    #Groq call
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a strict JSON generator. Output ONLY valid JSON. No extra text."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    ai_response = completion.choices[0].message.content

    #Safe JSON parsing ko lagi
    try:
        ai_data = json.loads(ai_response)

    except Exception as e:
        logger.error(f"AI JSON parsing failed: {ai_response}")
        raise HTTPException(
            status_code=500,
            detail="AI returned invalid JSON"
        )

    #Extracting AI data
    itinerary = ai_data.get("itinerary", [])
    travel_tips = ai_data.get("travel_tips", [])
    
    response_data = {
        "destination": destination.name,
        "travel_style": request.travel_style,
        "days": request.days,
        "estimated_budget": budget,
        "warning": warning,
        "itinerary": itinerary,
        "travel_tips": travel_tips
    }

    #Cache Store gareko
    try:
        redis_client.setex(cache_key, CACHE_TTL, json.dumps(response_data))
    except Exception as e:
        logger.warning(f"Redis write failed: {e}")

    logger.info(f"CACHED RESULT STORED: {cache_key}")

    return response_data