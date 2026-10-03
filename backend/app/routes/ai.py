from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from app.database import db
from app.middleware.auth import get_current_user
from app.services.ai_simulator import simulate_verification, calculate_risk_score

router = APIRouter(prefix="/api/ai", tags=["AI Simulation Engine"])

@router.post("/verify")
def api_ai_verify(payload: Dict[str, Any], current_user: dict = Depends(get_current_user)):
    scenario = payload.get("scenarioMode", "auto")
    custom_confidence = payload.get("customConfidence")
    image_metadata = payload.get("imageMetadata")
    return simulate_verification(scenario, custom_confidence, image_metadata)

@router.post("/risk-predict")
def api_ai_risk_predict(features: Dict[str, Any], current_user: dict = Depends(get_current_user)):
    return calculate_risk_score(features)

@router.get("/scenarios")
def get_ai_scenarios():
    return [
        {
            "id": "safe",
            "name": "Scenario 1: Daytime Authorized Owner (Safe)",
            "description": "Owner unlocking vehicle during daylight with excellent biometric confidence.",
            "confidence": 96.0,
            "failed_attempts": 0,
            "access_hour": 10,
            "recent_requests": 1,
            "suspicious_history": False,
            "expected_risk": "Low (10-20)",
            "expected_outcome": "Simulated Access Granted"
        },
        {
            "id": "medium",
            "name": "Scenario 2: Off-Hours Ambiguous Attempt (Medium Risk)",
            "description": "Late night access with degraded image confidence and previous retry.",
            "confidence": 72.0,
            "failed_attempts": 1,
            "access_hour": 23,
            "recent_requests": 3,
            "suspicious_history": False,
            "expected_risk": "Medium (50-60)",
            "expected_outcome": "Additional Verification Required"
        },
        {
            "id": "high",
            "name": "Scenario 3: Anomaly / Intrusion Threat (High Risk)",
            "description": "Early morning burst requests with poor facial match and flagged history.",
            "confidence": 48.0,
            "failed_attempts": 4,
            "access_hour": 2,
            "recent_requests": 7,
            "suspicious_history": True,
            "expected_risk": "High (85-95)",
            "expected_outcome": "Simulated Access Denied & Security Alert"
        }
    ]

@router.get("/statistics")
def get_ai_statistics(current_user: dict = Depends(get_current_user)):
    logs = db.access_logs.find()
    
    total = len(logs)
    if total == 0:
        return {
            "totalEvaluations": 0,
            "averageConfidence": 92.5,
            "averageRiskScore": 24,
            "riskDistribution": [
                {"name": "Low Risk", "count": 18, "percentage": 75, "color": "#10b981"},
                {"name": "Medium Risk", "count": 4, "percentage": 17, "color": "#f59e0b"},
                {"name": "High Risk", "count": 2, "percentage": 8, "color": "#ef4444"}
            ],
            "confidenceBuckets": [
                {"range": "90-100%", "count": 16},
                {"range": "75-89%", "count": 5},
                {"range": "60-74%", "count": 2},
                {"range": "<60%", "count": 1}
            ]
        }

    low_count = sum(1 for l in logs if l.get("riskLevel") == "low")
    med_count = sum(1 for l in logs if l.get("riskLevel") == "medium")
    high_count = sum(1 for l in logs if l.get("riskLevel") == "high")

    avg_conf = sum(float(l.get("confidence", 90)) for l in logs) / total
    avg_risk = sum(int(l.get("riskScore", 20)) for l in logs) / total

    c_90 = sum(1 for l in logs if float(l.get("confidence", 0)) >= 90)
    c_75 = sum(1 for l in logs if 75 <= float(l.get("confidence", 0)) < 90)
    c_60 = sum(1 for l in logs if 60 <= float(l.get("confidence", 0)) < 75)
    c_low = sum(1 for l in logs if float(l.get("confidence", 0)) < 60)

    return {
        "totalEvaluations": total,
        "averageConfidence": round(avg_conf, 1),
        "averageRiskScore": round(avg_risk, 1),
        "riskDistribution": [
            {"name": "Low Risk", "count": low_count, "percentage": round((low_count / total) * 100), "color": "#10b981"},
            {"name": "Medium Risk", "count": med_count, "percentage": round((med_count / total) * 100), "color": "#f59e0b"},
            {"name": "High Risk", "count": high_count, "percentage": round((high_count / total) * 100), "color": "#ef4444"}
        ],
        "confidenceBuckets": [
            {"range": "90-100%", "count": c_90},
            {"range": "75-89%", "count": c_75},
            {"range": "60-74%", "count": c_60},
            {"range": "<60%", "count": c_low}
        ]
    }
