from pydantic import BaseModel, EmailStr

class ProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    
    class Config:
        orm_mode = True

class ProfileUpdate(BaseModel):
    name: str
    email: EmailStr

class PasswordChange(BaseModel):
    current_password: str
    new_password: str