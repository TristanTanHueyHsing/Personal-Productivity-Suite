from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas.journal import JournalCreate, JournalUpdate, JournalResponse
from app.models.journal import Journal
from app.models.user import User
from app.database.connection import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/journals/{user_id}", response_model=List[JournalResponse])
async def get_journals(user_id: int, db: Session = Depends(get_db)):
    journals = db.query(Journal).filter(Journal.user_id == user_id).order_by(Journal.created_at.desc()).all()
    return journals

@router.post("/journals/{user_id}", response_model=JournalResponse)
async def create_journal(user_id: int, journal: JournalCreate, db: Session = Depends(get_db)):
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_journal = Journal(
        title=journal.title,
        content=journal.content,
        mood=journal.mood,
        tags=journal.tags,
        user_id=user_id
    )
    db.add(db_journal)
    db.commit()
    db.refresh(db_journal)
    return db_journal

@router.get("/journals/entry/{journal_id}", response_model=JournalResponse)
async def get_journal_entry(journal_id: int, db: Session = Depends(get_db)):
    journal = db.query(Journal).filter(Journal.id == journal_id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return journal

@router.put("/journals/entry/{journal_id}", response_model=JournalResponse)
async def update_journal(journal_id: int, journal_update: JournalUpdate, db: Session = Depends(get_db)):
    db_journal = db.query(Journal).filter(Journal.id == journal_id).first()
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    if journal_update.title is not None:
        db_journal.title = journal_update.title
    if journal_update.content is not None:
        db_journal.content = journal_update.content
    if journal_update.mood is not None:
        db_journal.mood = journal_update.mood
    if journal_update.tags is not None:
        db_journal.tags = journal_update.tags
    
    db.commit()
    db.refresh(db_journal)
    return db_journal

@router.delete("/journals/entry/{journal_id}")
async def delete_journal(journal_id: int, db: Session = Depends(get_db)):
    db_journal = db.query(Journal).filter(Journal.id == journal_id).first()
    if not db_journal:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    db.delete(db_journal)
    db.commit()
    return {"message": "Journal entry deleted successfully"}