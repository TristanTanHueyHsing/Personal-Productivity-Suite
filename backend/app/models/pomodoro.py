from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database.connection import Base
from datetime import datetime, date

def get_local_time():
    return datetime.now()

class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    focus_sessions_completed = Column(Integer, default=0)  # Number of completed focus sessions
    session_date = Column(Date, default=date.today)  # Date of the session
    created_at = Column(DateTime, default=get_local_time)
    updated_at = Column(DateTime, default=get_local_time, onupdate=get_local_time)
    
    # Relationship
    user = relationship("User", back_populates="pomodoro_sessions")

