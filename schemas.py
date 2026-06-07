from pydantic import BaseModel, EmailStr , Field
from enum import Enum

#Registration Logic
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    phone: str
    password:str

#Login Logic
class UserLogin(BaseModel):
    email: EmailStr
    password: str

#Output without displaying password
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    phone:str
    
    class Config:
        from_attributes = True
        
        
#Destinations Seed

class DestinationImageOut(BaseModel):
    id: int
    image_url : str
    
    class Config:
        from_attributes = True

class DestinationBase(BaseModel):
    name : str
    destination_type: str
    location: str
    short_description: str
    category: str

class DestinationCreate(DestinationBase):
    pass

class DestinationOut(DestinationBase):
    id:int
    slug: str
    
    full_description: str | None = None
    best_time_to_visit: str | None = None
    weather: str | None = None
    altitude: str | None = None
    highlights: list[str] = []
    activities: list[str] = []
    
    images : list[DestinationImageOut] = []
    
    class Config:
        from_attributes = True
        
#Destinations Page

class DestinationCard(BaseModel):
    id: int
    name: str
    slug: str
    destination_type: str
    location: str
    short_description: str
    category: str
    cover_image: str | None =  None
    
    class Config:
        from_attributes = True


#Itinerary generator

class TravelStyle(str, Enum):
    relaxed = "relaxed"
    adventure = "adventure"
    budget = "budget"

#Req
class ItineraryRequest(BaseModel):
    destination_slug: str
    days: int = Field(ge=1, le=30)
    travel_style: TravelStyle

#Res
class ItineraryActivity(BaseModel):
    time: str
    activity: str
    
class ItineraryDay(BaseModel):
    day: int
    title: str
    schedule: list[ItineraryActivity]

class BudgetEstimate(BaseModel):
    currency: str
    min_amount: int
    max_amount: int

class ItineraryResponse(BaseModel):
    destination: str
    travel_style: TravelStyle
    days: int
    
    estimated_budget: BudgetEstimate
    
    warning: str | None = None
    
    itinerary: list[ItineraryDay]
    travel_tips: list[str] = []
    