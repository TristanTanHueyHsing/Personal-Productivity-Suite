from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import request_validation_exception_handler
from app.database.connection import Base, engine
from app.models import user, notes, todo, journal, pomodoro
from app.routes import user as user_routes, notes as note_routes, todo as todo_routes, journal as journal_routes, profile as profile_routes, pomodoro as pomodoro_routes

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
app.include_router(user_routes.router, tags=["users"])
app.include_router(note_routes.router, prefix="/api", tags=["notes"])
app.include_router(todo_routes.router, prefix="/api", tags=["todos"])
app.include_router(journal_routes.router, prefix="/api", tags=["journals"])
app.include_router(profile_routes.router, prefix="/api", tags=["profile"]) 
app.include_router(pomodoro_routes.router, prefix="/api", tags=["pomodoro"]) 

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