from pydantic import BaseModel, EmailStr

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
    highlights: list[str] | None = None
    activities: list[str] | None = None
    
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
    