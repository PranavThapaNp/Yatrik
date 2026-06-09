import joblib
import numpy as np

#Load trained articles
model = joblib.load("ml/recommender_model.pkl")
encoders = joblib.load("ml/feature_encoders.pkl")
target_encoder = joblib.load("ml/target_encoder.pkl")

def encode_input(data: dict): #Convert raw user input into ML format
  
    encoded = []

    # numerical
    encoded.append(data["budget"])
    encoded.append(data["days"])

    # categorical
    data["season"] = data["season"].lower()
    data["travel_style"] = data["travel_style"].lower()
    data["destination_type"] = data["destination_type"].lower()

    for col in ["season", "travel_style", "destination_type"]:
        encoded.append(encoders[col].transform([data[col]])[0])

    return np.array(encoded).reshape(1, -1)


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