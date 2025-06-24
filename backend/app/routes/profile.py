from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.profile import ProfileUpdate, PasswordChange, ProfileResponse
from app.models.user import User
from app.models.notes import Note
from app.models.todo import Todo
from app.models.journal import Journal
from app.models.pomodoro import PomodoroSession
from app.database.connection import SessionLocal
from app.core.security import hash_password, verify_password, is_strong_password
import sqlalchemy.exc

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/profile/{user_id}", response_model=ProfileResponse)
async def get_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return ProfileResponse(
        id=user.id,
        name=user.username,
        email=user.email
    )

@router.put("/profile/{user_id}")
async def update_profile(user_id: int, profile_data: ProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if email is already taken by another user
    if profile_data.email != user.email:
        existing_user = db.query(User).filter(
            User.email == profile_data.email,
            User.id != user_id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists")
    
    # Update user data
    user.username = profile_data.name
    user.email = profile_data.email
    
    try:
        db.commit()
        db.refresh(user)
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already exists")
    
    return {"status": "success", "message": "Profile updated successfully"}

@router.put("/profile/{user_id}/password")
async def change_password(user_id: int, password_data: PasswordChange, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not verify_password(password_data.current_password, user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Validate new password strength
    if not is_strong_password(password_data.new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must include at least one uppercase letter, one number, 8 characters long and one symbol"
        )
    
    # Update password
    user.password = hash_password(password_data.new_password)
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update password")
    
    return {"status": "success", "message": "Password changed successfully"}

@router.delete("/profile/{user_id}")
async def delete_profile(user_id: int, db: Session = Depends(get_db)):
    """
    Delete user profile and ALL associated data
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Count data before deletion for logging
        notes_count = db.query(Note).filter(Note.user_id == user_id).count()
        todos_count = db.query(Todo).filter(Todo.user_id == user_id).count()
        journals_count = db.query(Journal).filter(Journal.user_id == user_id).count()
        pomodoro_count = db.query(PomodoroSession).filter(PomodoroSession.user_id == user_id).count()
        
        print(f"[ACCOUNT DELETION] User {user_id} ({user.email}):")
        print(f"  - Notes: {notes_count}")
        print(f"  - Todos: {todos_count}")
        print(f"  - Journals: {journals_count}")
        print(f"  - Pomodoro Sessions: {pomodoro_count}")
        
        # Delete user - this will cascade delete all related data
        # due to the cascade="all, delete-orphan" in relationships
        db.delete(user)
        db.commit()
        
        print(f"[ACCOUNT DELETION COMPLETE] User {user_id} and all associated data deleted")
        
    except Exception as e:
        db.rollback()
        print(f"[ACCOUNT DELETION FAILED] User {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete profile")
    
    return {
        "status": "success", 
        "message": "Profile and all associated data deleted successfully",
        "deleted_data": {
            "notes": notes_count,
            "todos": todos_count,
            "journals": journals_count,
            "pomodoro_sessions": pomodoro_count
        }
    }