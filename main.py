from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from database import Base, engine
from routers import auth, users, destinations, itinerary
import os

from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Yatrik")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR,"static")), name="static")

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(destinations.router)
app.include_router(itinerary.router)

@app.get("/")
def root():
    return{"message":"Yatrik is here."}