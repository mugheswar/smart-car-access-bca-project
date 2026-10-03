from fastapi import APIRouter, Depends, HTTPException, status
from app.database import db
from app.middleware.auth import get_current_user
from typing import List, Optional

router = APIRouter(prefix="/api/security", tags=["Security & Alerts"])

@router.get("/events")
def get_security_events(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") == "admin":
        events = db.security_events.find(sort_by="timestamp", reverse=True)
    else:
        events = db.security_events.find({"userId": current_user["_id"]}, sort_by="timestamp", reverse=True)
    return events

@router.put("/events/{event_id}/review")
def review_security_event(event_id: str, current_user: dict = Depends(get_current_user)):
    ev = db.security_events.find_one({"_id": event_id})
    if not ev:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Security event not found.")
    db.security_events.update_one({"_id": event_id}, {"status": "reviewed"})
    return {"message": "Event marked as reviewed."}

@router.get("/alerts")
def get_security_alerts(current_user: dict = Depends(get_current_user)):
    alerts = db.notifications.find({"userId": current_user["_id"]}, sort_by="timestamp", reverse=True, limit=20)
    if not alerts and current_user.get("role") == "admin":
        alerts = db.notifications.find(sort_by="timestamp", reverse=True, limit=20)
    return alerts

@router.put("/alerts/{alert_id}/read")
def mark_alert_read(alert_id: str, current_user: dict = Depends(get_current_user)):
    db.notifications.update_one({"_id": alert_id}, {"read": True})
    return {"message": "Notification marked as read."}

@router.get("/score")
def get_security_score(current_user: dict = Depends(get_current_user)):
    logs = db.access_logs.find({"userId": current_user["_id"]})
    if not logs:
        return {
            "score": 92,
            "status": "LOW RISK",
            "tier": "low",
            "activeAlerts": 0,
            "verifiedSessions": 12,
            "failedAttempts": 0
        }

    high_risk_count = sum(1 for l in logs if l.get("riskLevel") == "high")
    med_risk_count = sum(1 for l in logs if l.get("riskLevel") == "medium")
    total = len(logs)

    # Compute aggregate score
    penalty = (high_risk_count * 15) + (med_risk_count * 5)
    score = max(35, min(98, 100 - penalty))

    if score >= 75:
        tier = "low"
        status_text = "LOW RISK"
    elif score >= 50:
        tier = "medium"
        status_text = "MODERATE RISK"
    else:
        tier = "high"
        status_text = "HIGH RISK"

    return {
        "score": score,
        "status": status_text,
        "tier": tier,
        "activeAlerts": high_risk_count,
        "verifiedSessions": sum(1 for l in logs if l.get("accessStatus") == "granted"),
        "failedAttempts": sum(1 for l in logs if l.get("accessStatus") == "denied")
    }
