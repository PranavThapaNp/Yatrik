import joblib
import numpy as np
import pandas as pd

#Load trained articles
model = joblib.load("ml/recommender_model.pkl")
encoders = joblib.load("ml/feature_encoders.pkl")
target_encoder = joblib.load("ml/target_encoder.pkl")


def encode_input(data: dict):

    encoded = []

    encoded.append(data["budget"])
    encoded.append(data["days"])

    season = str(data["season"]).lower().strip()
    travel_style = str(data["travel_style"]).lower().strip()
    destination_type = str(data["destination_type"]).lower().strip()

    def safe_transform(col, value):
        le = encoders[col]
        if value in le.classes_:
            return le.transform([value])[0]
        return 0

    encoded.append(safe_transform("season", season))
    encoded.append(safe_transform("travel_style", travel_style))
    encoded.append(safe_transform("destination_type", destination_type))

    return pd.DataFrame([encoded], columns=[
        "budget",
        "days",
        "season",
        "travel_style",
        "destination_type"
    ])


def predict_top_3(data: dict): #Returns top 3 recommended destinations using probabilities
   
    X = encode_input(data)

    # Get probability scores for ALL classes
    probs = model.predict_proba(X)[0]

    # Get top 3 indices
    top_3_idx = np.argsort(probs)[::-1][:3]

    results = []

    for idx in top_3_idx:
        results.append({
            "destination": target_encoder.inverse_transform([idx])[0],
            "confidence": float(probs[idx])
        })

    return results