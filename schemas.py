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