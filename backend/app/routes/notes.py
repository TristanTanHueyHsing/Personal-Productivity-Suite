from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas.notes import NoteCreate, NoteUpdate, NoteResponse
from app.models.notes import Note
from app.database.connection import SessionLocal
from datetime import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# For now, we'll use a simple user_id parameter until you add JWT auth
@router.get("/notes/{user_id}", response_model=List[NoteResponse])
async def get_user_notes(user_id: int, db: Session = Depends(get_db)):
    notes = db.query(Note).filter(Note.user_id == user_id).order_by(Note.last_modified.desc()).all()
    return notes

@router.post("/notes/{user_id}", response_model=NoteResponse)
async def create_note(user_id: int, note: NoteCreate, db: Session = Depends(get_db)):
    # Generate preview from content
    preview = note.content[:150].replace('\n', ' ').strip()
    if len(note.content) > 150:
        preview += "..."
    
    new_note = Note(
        title=note.title,
        content=note.content,
        preview=preview,
        user_id=user_id
    )
    
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@router.put("/notes/{note_id}", response_model=NoteResponse)
async def update_note(note_id: int, note_update: NoteUpdate, db: Session = Depends(get_db)):
    existing_note = db.query(Note).filter(Note.id == note_id).first()
    if not existing_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    update_data = note_update.dict(exclude_unset=True)
    
    # Update preview if content is being updated
    if "content" in update_data:
        content = update_data["content"]
        preview = content[:150].replace('\n', ' ').strip()
        if len(content) > 150:
            preview += "..."
        update_data["preview"] = preview
    
    for field, value in update_data.items():
        setattr(existing_note, field, value)
    
    existing_note.last_modified = datetime.utcnow()
    db.commit()
    db.refresh(existing_note)
    return existing_note

@router.delete("/notes/{note_id}")
async def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(note)
    db.commit()
    return {"status": "success", "message": "Note deleted successfully"}
