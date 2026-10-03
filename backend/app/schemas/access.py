from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class AccessRequestModel(BaseModel):
    vehicleId: str
    scenarioMode: Optional[str] = "safe"  # safe, medium, high, auto

class IdentityVerifyModel(BaseModel):
    vehicleId: str
    scenarioMode: Optional[str] = "safe"
    customConfidence: Optional[float] = None
    imageMetadata: Optional[Dict[str, Any]] = None

class AIAnalyzeModel(BaseModel):
    vehicleId: str
    scenarioMode: Optional[str] = "safe"
    confidence: Optional[float] = None
    failedAttempts: Optional[int] = 0
    accessHour: Optional[int] = 10
    recentRequests: Optional[int] = 1
    suspiciousHistory: Optional[bool] = False

class SimulateUnlockModel(BaseModel):
    vehicleId: str
    accessLogId: Optional[str] = None

class SimulateLockModel(BaseModel):
    vehicleId: str

class AccessLogResponse(BaseModel):
    id: str
    userId: str
    userName: Optional[str] = None
    vehicleId: str
    vehicleName: Optional[str] = None
    registrationNumber: Optional[str] = None
    verificationStatus: str
    confidence: float
    riskScore: int
    riskLevel: str
    accessStatus: str
    policyAction: str
    timestamp: str
    recommendation: Optional[str] = None
    riskFactors: Optional[List[str]] = None
