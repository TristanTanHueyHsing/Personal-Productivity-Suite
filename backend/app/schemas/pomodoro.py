from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

# Remove user_id since it comes from URL parameter now
class PomodoroSessionCreate(BaseModel):
    pass  # No fields needed since user_id comes from URL

class PomodoroSessionUpdate(BaseModel):
    focus_sessions_completed: int

class PomodoroSessionResponse(BaseModel):
    id: int
    user_id: int
    focus_sessions_completed: int
    session_date: date
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class DailyStatsResponse(BaseModel):
    session_date: date
    focus_sessions_completed: int
    total_focus_time_minutes: int  