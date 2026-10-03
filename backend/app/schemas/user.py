from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=120)
    phone: str = Field(..., min_length=7, max_length=20)
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: str = Field(..., min_length=5)
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    role: str
    status: str
    createdAt: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
