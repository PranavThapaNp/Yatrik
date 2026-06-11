from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from database import Base, engine
from routers import auth, users, destinations, itinerary, recommend, saved, dashboard
import os

from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

app = FastAPI(title="Yatrik")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR,"static")), name="static")

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(destinations.router)
app.include_router(itinerary.router)
app.include_router(recommend.router)
app.include_router(saved.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return{"message":"Yatrik is here."}