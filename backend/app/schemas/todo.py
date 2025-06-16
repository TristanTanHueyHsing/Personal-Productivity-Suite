from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TodoCreate(BaseModel):
    text: str
    priority: str = "medium"

class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None

class TodoResponse(BaseModel):
    id: int
    text: str
    completed: bool
    priority: str
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True