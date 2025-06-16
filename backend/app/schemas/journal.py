from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class JournalCreate(BaseModel):
    title: str
    content: str
    mood: str = "neutral"
    tags: List[str] = []

class JournalUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None
    tags: Optional[List[str]] = None

class JournalResponse(BaseModel):
    id: int
    title: str
    content: str
    mood: str
    tags: List[str]
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True