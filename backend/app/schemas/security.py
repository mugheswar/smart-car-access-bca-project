from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class SecurityEventModel(BaseModel):
    id: str
    userId: Optional[str] = None
    userName: Optional[str] = None
    vehicleId: Optional[str] = None
    vehicleInfo: Optional[str] = None
    eventType: str
    severity: str  # low, medium, high
    description: str
    riskScore: Optional[int] = None
    timestamp: str
    status: str = "active"  # active, reviewed, resolved

class NotificationModel(BaseModel):
    id: str
    userId: Optional[str] = None
    title: str
    message: str
    type: str  # info, success, warning, danger
    timestamp: str
    read: bool = False
