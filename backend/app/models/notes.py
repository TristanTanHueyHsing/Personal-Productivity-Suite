from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base
from datetime import datetime

def get_local_time():
    return datetime.now()

class Note(Base):
    __tablename__ = "notes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, default="Untitled Note")
    content = Column(Text, nullable=False, default="")
    preview = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_modified = Column(DateTime, default=get_local_time, onupdate=get_local_time)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationship with User
    user = relationship("User", back_populates="notes")
