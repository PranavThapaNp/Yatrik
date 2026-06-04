from fastapi import APIRouter, Depends
from auth.oauth2 import get_current_user

router = APIRouter(
    prefix ="/users",
    tags =["Users"]
)

@router.get("/me")
def get_me(user_id: int = Depends(get_current_user)):
    return{"user_id": user_id}