from pydantic import BaseModel, Field
from typing import Optional

class VehicleCreate(BaseModel):
    registrationNumber: str = Field(..., min_length=4, max_length=20)
    brand: str = Field(..., min_length=2, max_length=50)
    model: str = Field(..., min_length=1, max_length=50)
    type: str = Field(default="SUV", max_length=30)
    year: int = Field(default=2025, ge=1990, le=2030)
    color: str = Field(default="White", max_length=30)

class VehicleUpdate(BaseModel):
    registrationNumber: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    type: Optional[str] = None
    year: Optional[int] = None
    color: Optional[str] = None
    status: Optional[str] = None  # locked, unlocked, access_requested

class VehicleResponse(BaseModel):
    id: str
    ownerId: str
    registrationNumber: str
    brand: str
    model: str
    type: str
    year: int
    color: str
    status: str
    createdAt: str
    securityScore: Optional[int] = 92
    lastAccess: Optional[str] = None
