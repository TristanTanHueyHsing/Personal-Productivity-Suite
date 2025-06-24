from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin, PasswordReset
from app.models.user import User
from app.database.connection import SessionLocal
from app.core.security import hash_password, verify_password, is_strong_password, hash_security_key, verify_security_key, is_valid_security_key
import sqlalchemy.exc

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register new user with collision prevention"""
    
    # Validate password strength
    if not is_strong_password(user.password):
        raise HTTPException(
            status_code=400,
            detail="Password must include at least one uppercase letter, one number, 8 characters long and one symbol"
        )

    # Validate security key format
    if not is_valid_security_key(user.security_key):
        raise HTTPException(
            status_code=400,
            detail="Security key must be exactly 16 characters long and contain only letters and numbers"
        )

    # COLLISION PREVENTION: Check if security key already exists (before hashing)
    # This requires checking against all existing users
    existing_users = db.query(User).all()
    
    for existing_user in existing_users:
        if verify_security_key(user.security_key, existing_user.security_key):
            # Collision detected during registration!
            print(f"[SECURITY KEY COLLISION PREVENTED] Key already exists for user: {existing_user.email}")
            
            raise HTTPException(
                status_code=409,
                detail="Security key already exists. Please generate a new one."
            )
    
    # If we get here, security key is unique
    hashed_pw = hash_password(user.password)
    hashed_security_key = hash_security_key(user.security_key)
    
    new_user = User(
        email=user.email, 
        username=user.username, 
        password=hashed_pw,
        security_key=hashed_security_key
    )
    
    db.add(new_user)
    try:
        db.commit()
        print(f"[USER REGISTRATION] New user created: {user.email} with unique security key")
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already exists")

    return {"status": "success", "message": "Account created successfully"}

@router.post("/login")
async def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if user and verify_password(data.password, user.password):
        return {
            "status": "success", 
            "message": "Login successful",
            "user_id": user.id,       
            "username": user.username,    
            "email": user.email       
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/reset-password")
async def reset_password(data: PasswordReset, db: Session = Depends(get_db)):
    """Reset password using security key - with collision detection"""
    
    # Validate new password strength
    if not is_strong_password(data.new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must include at least one uppercase letter, one number, 8 characters long and one symbol"
        )
    
    # Validate security key format
    if not is_valid_security_key(data.security_key):
        raise HTTPException(
            status_code=400,
            detail="Invalid security key format"
        )
    
    # Find ALL users that match the security key
    users = db.query(User).all()
    matching_users = []
    
    for user in users:
        if verify_security_key(data.security_key, user.security_key):
            matching_users.append(user)
    
    # Handle different scenarios
    if len(matching_users) == 0:
        # No matches found
        print(f"[PASSWORD RESET] Invalid security key attempted")
        raise HTTPException(
            status_code=404, 
            detail="Invalid security key. Please check your security key and try again."
        )
    
    elif len(matching_users) == 1:
        # Perfect! Exactly one match (normal case)
        target_user = matching_users[0]
        
        try:
            target_user.password = hash_password(data.new_password)
            db.commit()
            
            print(f"[PASSWORD RESET] Password reset successful for user: {target_user.email}")
            
            return {
                "status": "success", 
                "message": "Password reset successfully"
            }
            
        except Exception as e:
            db.rollback()
            print(f"[PASSWORD RESET ERROR] Failed to reset password: {str(e)}")
            raise HTTPException(
                status_code=500, 
                detail="Failed to reset password. Please try again."
            )
    
    else:
        # COLLISION DETECTED! Multiple users have the same security key
        print(f"[SECURITY KEY COLLISION DETECTED] Found {len(matching_users)} users with same security key!")
        print("  Affected users:")
        for user in matching_users:
            print(f"    - User ID {user.id}: {user.email}")
        
        # Security decision: Reject the reset request
        raise HTTPException(
            status_code=409,  # Conflict status code
            detail="Security key collision detected. Multiple accounts found with this key. Please contact support for assistance."
        )