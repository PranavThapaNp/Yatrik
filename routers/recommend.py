from fastapi import APIRouter
from schemas import RecommendRequest
from ml.predict import predict_top_3

router = APIRouter(prefix="/recommend", tags=["ML Recommendation"])

@router.post("/top")
def recommend_top(payload: RecommendRequest):
   
    results = predict_top_3(payload.dict())

    return {
        "recommended_destination": results
    }