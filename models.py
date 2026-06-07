from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
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
    
    #Details Card
    id =  Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    slug = Column(String,unique=True, index=True)
    destination_type =  Column(String)
    location = Column(String, index=True)
    short_description = Column(String, index=True)
    category = Column(String, index=True)

    #Details Page
    full_description = Column(String)
    best_time_to_visit = Column(String)
    weather = Column(String, nullable= True)
    altitude = Column(String, nullable= True)
    highlights = Column(ARRAY(String))
    activities = Column(ARRAY(String))
    
    #Duration
    min_days = Column(Integer, nullable= False)
    recommended_days = Column(Integer, nullable= True)
    
    images = relationship("DestinationImage", back_populates="destination", cascade="all, delete")

class DestinationImage(Base):
    __tablename__ = "destination_images"
    
    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"), index=True)
    image_url = Column(String)
    order = Column(Integer, default=0)
    
    destination = relationship("Destinations", back_populates="images")