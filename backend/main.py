from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#dummy user for demo
users_db = {
    "user@gmail.com": "password123"
}

class LoginData(BaseModel):
    email: str
    password: str

@app.post("/login")
async def login(data: LoginData):
    email = data.email
    password = data.password

    if email in users_db and users_db[email] == password:
        print(f"[LOGIN SUCCESS] User logged in: {email}")
        return {"status": "success", "message": "Login successful"}
    else:
        print(f"[LOGIN FAIL] Invalid credentials for: {email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/data")
def read_data():
    return {"message": "Hello from FastAPI"}