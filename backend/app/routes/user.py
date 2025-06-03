from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin
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

@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    if not is_strong_password(user.password):
        raise HTTPException(
            status_code=400,
            detail="Password must include at least one uppercase letter, one number, 8 characters long and one symbol"
        )

    hashed_pw = hash_password(user.password)
    new_user = User(email=user.email, username=user.username, password=hashed_pw)
    db.add(new_user)
    try:
        db.commit()
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already exists")

    return {"status": "success", "message": "Account created successfully"}

@router.post("/login")
async def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if user and verify_password(data.password, user.password):
        return {"status": "success", "message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
