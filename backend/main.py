# from fastapi import FastAPI, HTTPException, Request
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # React dev server
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# #dummy user for demo
# users_db = {
#     "user@gmail.com": "password123"
# }

# class LoginData(BaseModel):
#     email: str
#     password: str

# @app.post("/login")
# async def login(data: LoginData):
#     email = data.email
#     password = data.password

#     if email in users_db and users_db[email] == password:
#         print(f"[LOGIN SUCCESS] User logged in: {email}")
#         return {"status": "success", "message": "Login successful"}
#     else:
#         print(f"[LOGIN FAIL] Invalid credentials for: {email}")
#         raise HTTPException(status_code=401, detail="Invalid credentials")

# @app.get("/data")
# def read_data():
#     return {"message": "Hello from FastAPI"}

#####################################################

# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, EmailStr
# from sqlalchemy import Column, Integer, String, create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# from passlib.context import CryptContext
# import sqlalchemy.exc

# # FastAPI app
# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Password hashing setup
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)

# # Database setup
# DATABASE_URL = "sqlite:///./users.db"
# engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# Base = declarative_base()
# SessionLocal = sessionmaker(bind=engine)
# db = SessionLocal()

# # SQLAlchemy model
# class User(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True)
#     password = Column(String)

# Base.metadata.create_all(bind=engine)

# # Insert test user only if not exists
# test_email = "test@example.com"
# test_password = "test1234"
# existing_test_user = db.query(User).filter(User.email == test_email).first()

# if not existing_test_user:
#     test_user = User(
#         email=test_email,
#         password=hash_password(test_password)
#     )
#     db.add(test_user)
#     db.commit()
#     print("[TEST USER CREATED] Email: test@example.com | Password: test1234")
# else:
#     print("[TEST USER EXISTS] Email: test@example.com")


# # Pydantic models
# class UserCreate(BaseModel):
#     email: EmailStr
#     password: str

# class UserOut(BaseModel):
#     email: EmailStr
#     class Config:
#         orm_mode = True

# # Register endpoint
# @app.post("/register")
# async def register(user: UserCreate):
#     existing_user = db.query(User).filter(User.email == user.email).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     hashed_pw = hash_password(user.password)
#     new_user = User(email=user.email, password=hashed_pw)
#     db.add(new_user)
#     try:
#         db.commit()
#     except sqlalchemy.exc.IntegrityError:
#         db.rollback()
#         raise HTTPException(status_code=400, detail="Email already exists")

#     return {"status": "success", "message": "Account created successfully"}

# # Login endpoint
# @app.post("/login")
# async def login(data: UserCreate):
#     user = db.query(User).filter(User.email == data.email).first()
#     if user and verify_password(data.password, user.password):
#         return {"status": "success", "message": "Login successful"}
#     raise HTTPException(status_code=401, detail="Invalid credentials")

# # Test endpoint
# @app.get("/data")
# def read_data():
#     return {"message": "Hello from FastAPI"}






# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, EmailStr
# from sqlalchemy import Column, Integer, String, create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# from passlib.context import CryptContext
# from fastapi.exceptions import RequestValidationError
# from fastapi.responses import JSONResponse  
# from fastapi.requests import Request
# from fastapi.exception_handlers import request_validation_exception_handler
# import re
# import sqlalchemy.exc

# # FastAPI app setup
# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Password hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)

# # Password strength check
# def is_strong_password(password: str) -> bool:
#     return bool(re.match(r'^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$', password))

# # Database setup
# DATABASE_URL = "sqlite:///./users.db"
# engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# Base = declarative_base()
# SessionLocal = sessionmaker(bind=engine)
# db = SessionLocal()

# # SQLAlchemy User model
# class User(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True)
#     username = Column(String, nullable=False)
#     password = Column(String)

# Base.metadata.create_all(bind=engine)

# # Create test user if not exists
# test_email = "test@example.com"
# test_password = "Test@1234"
# test_username = "testuser"

# if not db.query(User).filter(User.email == test_email).first():
#     test_user = User(
#         email=test_email,
#         username=test_username,
#         password=hash_password(test_password)
#     )
#     db.add(test_user)
#     db.commit()
#     print(f"[TEST USER CREATED] Email: {test_email} | Username: {test_username} | Password: {test_password}")
# else:
#     print(f"[TEST USER EXISTS] Email: {test_email}")

# # Pydantic models
# class UserCreate(BaseModel):
#     email: EmailStr
#     username: str
#     password: str

# class UserLogin(BaseModel):
#     email: EmailStr
#     password: str

# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request: Request, exc: RequestValidationError):
#     errors = exc.errors()
#     # Look for validation errors related to the email field
#     for err in errors:
#         if "email" in err.get("loc", []):
#             return JSONResponse(
#                 status_code=400,
#                 content={"detail": "Invalid email format. Please provide a valid email address with domain."},
#             )
#     # Fallback to default validation error handler for other errors
#     return await request_validation_exception_handler(request, exc)

# # Register endpoint
# @app.post("/register")
# async def register(user: UserCreate):
#     if not is_strong_password(user.password):
#         raise HTTPException(
#             status_code=400,
#             detail="Password must include at least one uppercase letter, one number, 8 characters long and one symbol"
#         )

#     hashed_pw = hash_password(user.password)
#     new_user = User(email=user.email, username=user.username, password=hashed_pw)
#     db.add(new_user)
#     try:
#         db.commit()
#     except sqlalchemy.exc.IntegrityError:
#         db.rollback()
#         raise HTTPException(status_code=400, detail="Email already exists")

#     return {"status": "success", "message": "Account created successfully"}

# # Login endpoint
# @app.post("/login")
# async def login(data: UserLogin):
#     user = db.query(User).filter(User.email == data.email).first()
#     if user and verify_password(data.password, user.password):
#         return {"status": "success", "message": "Login successful"}
#     raise HTTPException(status_code=401, detail="Invalid credentials")

# Add to your existing models section

# class Note(Base):
#     __tablename__ = "notes"
#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, nullable=True)
#     content = Column(String, nullable=False)

# Base.metadata.create_all(bind=engine)

# class NoteCreate(BaseModel):
#     title: str = "Untitled"
#     content: str

# @app.get("/notes")
# async def get_notes():
#     notes = db.query(Note).all()
#     return {"notes": [{"id": note.id, "title": note.title, "content": note.content} for note in notes]}

# @app.post("/notes/save")
# async def save_note(note: NoteCreate):
#     new_note = Note(title=note.title, content=note.content)
#     db.add(new_note)
#     db.commit()
#     db.refresh(new_note)
#     return {"status": "success", "note_id": new_note.id}

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import request_validation_exception_handler
from app.database.connection import Base, engine
from app.models import user
from app.routes import user as user_routes

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(user_routes.router)

# Custom validation handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    for err in exc.errors():
        if "email" in err.get("loc", []):
            return JSONResponse(
                status_code=400,
                content={"detail": "Invalid email format. Please provide a valid email address with domain."},
            )
    return await request_validation_exception_handler(request, exc)
