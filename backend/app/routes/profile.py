from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.profile import ProfileUpdate, PasswordChange, ProfileResponse
from app.models.user import User
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
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Delete user and all related data (cascade should handle this)
        db.delete(user)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete profile")
    
    return {"status": "success", "message": "Profile deleted successfully"}