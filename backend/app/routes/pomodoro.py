from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.pomodoro import PomodoroSessionUpdate, PomodoroSessionResponse, DailyStatsResponse
from app.models.pomodoro import PomodoroSession
from app.database.connection import SessionLocal
from datetime import date, datetime
from typing import List

router = APIRouter()

def get_local_time():
    return datetime.now()

def get_local_date():
    return date.today()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/pomodoro/session/{user_id}", response_model=PomodoroSessionResponse)
async def create_or_get_daily_session(user_id: int, db: Session = Depends(get_db)):
    """Create or get today's pomodoro session for a user (based on server local time)"""
    today = get_local_date()  # Get today's date in server local time
    
    # Check if session already exists for today
    existing_session = db.query(PomodoroSession).filter(
        PomodoroSession.user_id == user_id,
        PomodoroSession.session_date == today
    ).first()
    
    if existing_session:
        # Return existing session for today
        return existing_session
    
    # Create NEW session for today with focus_sessions_completed = 0
    new_session = PomodoroSession(
        user_id=user_id,
        focus_sessions_completed=0,  # Reset to 0 for new day
        session_date=today
    )
    
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    print(f"[NEW DAILY SESSION CREATED] User: {user_id}, Date: {today}, Focus Count: 0")
    return new_session

@router.put("/pomodoro/session/{session_id}/complete-focus", response_model=PomodoroSessionResponse)
async def complete_focus_session(session_id: int, db: Session = Depends(get_db)):
    """Increment focus sessions completed for today's session"""
    session = db.query(PomodoroSession).filter(PomodoroSession.id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Increment focus sessions completed
    session.focus_sessions_completed += 1
    session.updated_at = get_local_time()
    
    db.commit()
    db.refresh(session)
    
    print(f"[FOCUS SESSION COMPLETED] Session ID: {session_id}, New Count: {session.focus_sessions_completed}")
    return session

@router.get("/pomodoro/daily-stats/{user_id}", response_model=DailyStatsResponse)
async def get_daily_stats(user_id: int, target_date: date = None, db: Session = Depends(get_db)):
    """Get daily pomodoro statistics for a specific date (defaults to today)"""
    if target_date is None:
        target_date = get_local_date()  # Use server local date
    
    session = db.query(PomodoroSession).filter(
        PomodoroSession.user_id == user_id,
        PomodoroSession.session_date == target_date
    ).first()
    
    if not session:
        # Return zero stats if no session exists for the date
        return DailyStatsResponse(
            session_date=target_date,
            focus_sessions_completed=0,
            total_focus_time_minutes=0
        )
    
    # Calculate total focus time (assuming 25 minutes per focus session)
    focus_time_minutes = session.focus_sessions_completed * 25
    
    return DailyStatsResponse(
        session_date=session.session_date,
        focus_sessions_completed=session.focus_sessions_completed,
        total_focus_time_minutes=focus_time_minutes
    )

@router.get("/pomodoro/history/{user_id}", response_model=List[DailyStatsResponse])
async def get_pomodoro_history(user_id: int, limit: int = 30, db: Session = Depends(get_db)):
    """Get pomodoro history for the last N days"""
    sessions = db.query(PomodoroSession).filter(
        PomodoroSession.user_id == user_id
    ).order_by(PomodoroSession.session_date.desc()).limit(limit).all()
    
    history = []
    for session in sessions:
        focus_time_minutes = session.focus_sessions_completed * 25
        history.append(DailyStatsResponse(
            session_date=session.session_date,
            focus_sessions_completed=session.focus_sessions_completed,
            total_focus_time_minutes=focus_time_minutes
        ))
    
    return history