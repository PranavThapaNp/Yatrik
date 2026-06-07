def calculate_budget(days: int, travel_style: str, destination_type: str):
    """
    Deterministic Nepal travel budget engine.
    Uses destination_type instead of boolean flags.
    """

    base_costs = {
        "budget": 3000,
        "relaxed": 6000,
        "adventure": 8000
    }

    per_day = base_costs.get(travel_style, 5000)

    # Trekking is more expensive
    if destination_type == "trek":
        per_day *= 1.3   # permits, guides, remote food, gear

    # Adventure trips can also be slightly higher cost
    elif destination_type == "adventure":
        per_day *= 1.15

    min_buffer = 0.85
    max_buffer = 1.35

    return {
        "currency": "NPR",
        "min_amount": int(days * per_day * min_buffer),
        "max_amount": int(days * per_day * max_buffer)
    }