from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.connection import Base
from datetime import datetime

def get_local_time():
    return datetime.now()

class Journal(Base):
    __tablename__ = "journals"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    mood = Column(String, default="neutral")  # happy, sad, excited, thoughtful, etc.
    tags = Column(JSON, default=list)  # Store tags as JSON array
    created_at = Column(DateTime, default=get_local_time)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="journals")