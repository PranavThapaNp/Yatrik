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
        
        
#Destinations Page

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
    images : list[DestinationImageOut] = []
    
    class Config:
        from_attributes = True