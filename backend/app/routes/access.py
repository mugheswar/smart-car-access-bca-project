from fastapi import APIRouter, HTTPException, status, Depends, Query
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from app.database import db
from app.middleware.auth import get_current_user
from app.schemas.access import (
    AccessRequestModel,
    IdentityVerifyModel,
    AIAnalyzeModel,
    SimulateUnlockModel,
    SimulateLockModel,
    AccessLogResponse
)
from app.services.ai_simulator import (
    simulate_verification,
    calculate_risk_score,
    classify_risk
)

router = APIRouter(prefix="/api/access", tags=["Smart Access Workflow"])

@router.post("/request")
def request_access(data: AccessRequestModel, current_user: dict = Depends(get_current_user)):
    vehicle = db.vehicles.find_one({"_id": data.vehicleId})
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found.")
    
    # State update: LOCKED -> ACCESS REQUESTED
    now_iso = datetime.now(timezone.utc).isoformat()
    db.vehicles.update_one({"_id": data.vehicleId}, {"status": "access_requested"})
    
    # Add notification
    db.notifications.insert_one({
        "userId": current_user["_id"],
        "title": "Access Requested",
        "message": f"Keyless access sequence initiated for {vehicle.get('brand')} {vehicle.get('model')} ({vehicle.get('registrationNumber')})",
        "type": "info",
        "timestamp": now_iso,
        "read": False
    })

    return {
        "status": "access_requested",
        "message": "Access requested successfully. Ready for identity verification.",
        "vehicleId": vehicle["_id"],
        "vehicleName": f"{vehicle.get('brand')} {vehicle.get('model')}",
        "registrationNumber": vehicle.get("registrationNumber"),
        "timestamp": now_iso,
        "simulationDisclaimer": "Simulation Mode — No real vehicle control"
    }

@router.post("/verify")
def verify_identity(data: IdentityVerifyModel, current_user: dict = Depends(get_current_user)):
    vehicle = db.vehicles.find_one({"_id": data.vehicleId})
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found.")

    # Call AI verification simulator
    verification_result = simulate_verification(
        scenario_mode=data.scenarioMode or "safe",
        custom_confidence=data.customConfidence,
        image_metadata=data.imageMetadata
    )

    return {
        "success": True,
        "vehicleId": vehicle["_id"],
        "verification": verification_result,
        "simulationDisclaimer": "Simulation Mode — No real vehicle control"
    }

@router.post("/analyze")
def analyze_security(data: AIAnalyzeModel, current_user: dict = Depends(get_current_user)):
    vehicle = db.vehicles.find_one({"_id": data.vehicleId})
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found.")

    # Contextual features for AI risk engine
    features = {
        "confidence": data.confidence if data.confidence is not None else 96.0,
        "failed_attempts": data.failedAttempts or 0,
        "access_hour": data.accessHour if data.accessHour is not None else 10,
        "recent_requests": data.recentRequests or 1,
        "suspicious_history": data.suspiciousHistory or False,
        "unknown_device": False,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    # Evaluate dynamic risk score
    risk_assessment = calculate_risk_score(features)
    risk_score = risk_assessment["risk_score"]
    risk_level = risk_assessment["risk_level"]
    now_iso = datetime.now(timezone.utc).isoformat()

    # Determine access status
    if risk_level == "low":
        access_status = "granted"
        policy_message = "Simulated Access Granted"
    elif risk_level == "medium":
        access_status = "pending_verification"
        policy_message = "Additional Verification Required"
    else:
        access_status = "denied"
        policy_message = "Simulated Access Denied"

    # Create Access Log Record
    log_doc = {
        "userId": current_user["_id"],
        "userName": current_user.get("name", "Demo User"),
        "vehicleId": vehicle["_id"],
        "vehicleName": f"{vehicle.get('brand')} {vehicle.get('model')}",
        "registrationNumber": vehicle.get("registrationNumber"),
        "verificationStatus": "verified" if risk_level != "high" else "suspicious",
        "confidence": features["confidence"],
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "accessStatus": access_status,
        "policyAction": policy_message,
        "recommendation": risk_assessment["recommendation"],
        "riskFactors": risk_assessment["risk_factors"],
        "timestamp": now_iso
    }
    saved_log = db.access_logs.insert_one(log_doc)

    # If HIGH risk, automatically generate Security Event & alert notification
    if risk_level == "high":
        event_doc = {
            "userId": current_user["_id"],
            "userName": current_user.get("name"),
            "vehicleId": vehicle["_id"],
            "vehicleInfo": f"{vehicle.get('brand')} {vehicle.get('model')} ({vehicle.get('registrationNumber')})",
            "eventType": "unauthorized_high_risk_access_attempt",
            "severity": "high",
            "description": f"AI Security Analysis blocked an abnormal unlock attempt (Risk: {risk_score}/100, Hour: {features['access_hour']:02d}:00, Failures: {features['failed_attempts']}).",
            "riskScore": risk_score,
            "timestamp": now_iso,
            "status": "active"
        }
        db.security_events.insert_one(event_doc)

        db.notifications.insert_one({
            "userId": current_user["_id"],
            "title": "High Risk Access Blocked",
            "message": f"Simulated unlock denied for {vehicle.get('registrationNumber')}. Risk Score: {risk_score}/100.",
            "type": "danger",
            "timestamp": now_iso,
            "read": False
        })
    else:
        # Update vehicle security score
        new_security_score = max(50, 100 - (risk_score // 2))
        db.vehicles.update_one({"_id": vehicle["_id"]}, {"securityScore": new_security_score})

    return {
        "accessLogId": saved_log["_id"],
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "accessStatus": access_status,
        "policyAction": policy_message,
        "recommendation": risk_assessment["recommendation"],
        "riskFactors": risk_assessment["risk_factors"],
        "confidence": features["confidence"],
        "timestamp": now_iso,
        "simulationDisclaimer": "Simulation Mode — No real vehicle control"
    }

@router.post("/simulate-unlock")
def simulate_unlock(data: SimulateUnlockModel, current_user: dict = Depends(get_current_user)):
    vehicle = db.vehicles.find_one({"_id": data.vehicleId})
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found.")

    now_iso = datetime.now(timezone.utc).isoformat()
    # Update vehicle state to unlocked in simulation
    db.vehicles.update_one(
        {"_id": vehicle["_id"]},
        {"status": "unlocked", "lastAccess": now_iso}
    )

    db.notifications.insert_one({
        "userId": current_user["_id"],
        "title": "Vehicle Unlocked",
        "message": f"{vehicle.get('brand')} {vehicle.get('model')} door latches unlocked in simulation mode.",
        "type": "success",
        "timestamp": now_iso,
        "read": False
    })

    return {
        "status": "unlocked",
        "message": "✓ Access Granted — Simulation",
        "vehicleId": vehicle["_id"],
        "registrationNumber": vehicle.get("registrationNumber"),
        "timestamp": now_iso,
        "simulationDisclaimer": "Simulation Mode — No real vehicle control"
    }

@router.post("/simulate-lock")
def simulate_lock(data: SimulateLockModel, current_user: dict = Depends(get_current_user)):
    vehicle = db.vehicles.find_one({"_id": data.vehicleId})
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found.")

    now_iso = datetime.now(timezone.utc).isoformat()
    db.vehicles.update_one(
        {"_id": vehicle["_id"]},
        {"status": "locked"}
    )

    db.notifications.insert_one({
        "userId": current_user["_id"],
        "title": "Vehicle Locked",
        "message": f"{vehicle.get('brand')} {vehicle.get('model')} latches secured in simulation mode.",
        "type": "info",
        "timestamp": now_iso,
        "read": False
    })

    return {
        "status": "locked",
        "message": "Vehicle locked — Simulation",
        "vehicleId": vehicle["_id"],
        "registrationNumber": vehicle.get("registrationNumber"),
        "timestamp": now_iso,
        "simulationDisclaimer": "Simulation Mode — No real vehicle control"
    }

@router.get("/history")
def get_access_history(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    riskLevel: Optional[str] = None,
    vehicleId: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    query: Dict[str, Any] = {}
    if current_user.get("role") != "admin":
        query["userId"] = current_user["_id"]

    if status and status != "all":
        query["accessStatus"] = status
    if riskLevel and riskLevel != "all":
        query["riskLevel"] = riskLevel
    if vehicleId and vehicleId != "all":
        query["vehicleId"] = vehicleId

    all_logs = db.access_logs.find(query, sort_by="timestamp", reverse=True)

    if search:
        s = search.lower()
        all_logs = [
            l for l in all_logs
            if s in str(l.get("userName", "")).lower()
            or s in str(l.get("registrationNumber", "")).lower()
            or s in str(l.get("vehicleName", "")).lower()
        ]

    total = len(all_logs)
    start_idx = (page - 1) * limit
    paginated = all_logs[start_idx:start_idx + limit]

    formatted = []
    for item in paginated:
        formatted.append({
            "id": item["_id"],
            "userId": item.get("userId"),
            "userName": item.get("userName", "User"),
            "vehicleId": item.get("vehicleId"),
            "vehicleName": item.get("vehicleName", "Vehicle"),
            "registrationNumber": item.get("registrationNumber", "TN XX XX XXXX"),
            "verificationStatus": item.get("verificationStatus", "verified"),
            "confidence": float(item.get("confidence", 95)),
            "riskScore": int(item.get("riskScore", 12)),
            "riskLevel": item.get("riskLevel", "low"),
            "accessStatus": item.get("accessStatus", "granted"),
            "policyAction": item.get("policyAction", "Simulated Access Granted"),
            "timestamp": item.get("timestamp"),
            "recommendation": item.get("recommendation"),
            "riskFactors": item.get("riskFactors", [])
        })

    return {
        "items": formatted,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": max(1, (total + limit - 1) // limit)
    }
