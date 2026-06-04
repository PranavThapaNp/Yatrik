from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key = True, index = True)
    username = Column(String, unique = True, index = True)
    email = Column(String, unique = True, index = True)
    phone = Column(String, nullable = False)
    hashed_password = Column(String)

class Destinations(Base):
    __tablename__ = "destinations"
    
    id =  Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    slug = Column(String,unique=True, index=True)
    destination_type =  Column(String)
    location = Column(String)
    short_description = Column(String)
    category = Column(String)
    
    images = relationship("DestinationImage", back_populates="destination", cascade="all, delete")

class DestinationImage(Base):
    __tablename__ = "destination_images"
    
    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"), index=True)
    image_url = Column(String)
    
    destination = relationship("Destinations", back_populates="images")