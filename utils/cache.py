import redis
import json
import os

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)

def create_cache_key(destination_slug: str, days: int, travel_style: str):
    return f"itinerary:{destination_slug.lower()}:{days}:{travel_style.lower()}"