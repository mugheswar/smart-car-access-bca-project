"""
AI Simulation Service
Hidden Academic AI Engine for BCA Final Year Project
Provides local rule-based simulation of biometric verification and behavioral risk assessment.
"""

from typing import Dict, Any, List, Tuple
from datetime import datetime, timezone
import random

def classify_risk(risk_score: int) -> Tuple[str, str]:
    """Classify numerical risk score into standard risk tier and policy outcome."""
    if risk_score <= 30:
        return "low", "Simulated Access Granted"
    elif risk_score <= 70:
        return "medium", "Additional Verification Required"
    else:
        return "high", "Simulated Access Denied"

def generate_risk_factors(
    confidence: float,
    failed_attempts: int,
    access_hour: int,
    recent_requests: int,
    suspicious_history: bool,
    unknown_device: bool = False
) -> List[str]:
    """Synthesize plain-language risk factors based on security parameters."""
    factors = []
    if confidence < 60:
        factors.append(f"Low verification confidence score ({confidence:.1f}%)")
    elif confidence < 80:
        factors.append(f"Moderate verification confidence score ({confidence:.1f}%)")
    
    if failed_attempts >= 3:
        factors.append(f"High threshold of consecutive failed attempts ({failed_attempts} attempts)")
    elif failed_attempts >= 1:
        factors.append(f"Previous failed access attempt detected ({failed_attempts})")

    if access_hour >= 23 or access_hour <= 5:
        factors.append(f"Irregular off-hours access time window ({access_hour:02d}:00 hrs)")

    if recent_requests >= 5:
        factors.append(f"Unusually high request frequency detected ({recent_requests} attempts)")

    if suspicious_history:
        factors.append("Security warning: Vehicle or user flagged in previous intrusion event")

    if unknown_device:
        factors.append("Access request initiated from unverified hardware signature")

    if not factors:
        factors.append("All baseline metrics within acceptable operating thresholds")

    return factors

def generate_recommendation(risk_level: str, risk_score: int) -> str:
    """Actionable mitigation recommendation for the automotive access system."""
    if risk_level == "low":
        return "Standard authorization approved. Simulated door latch unlocked."
    elif risk_level == "medium":
        return "Additional identity verification or PIN entry required before granting simulated unlock."
    else:
        return "High intrusion probability. Access denied, vehicle simulated immobilizer secured, and security alert logged."

def calculate_risk_score(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Core AI Risk Assessment Algorithm (Hidden Rule Engine)
    Academic simulation formula:
    Base = 20
    Confidence < 60 -> +30 | < 80 -> +15 | >= 90 -> -10
    Failed attempts >= 3 -> +25 | >= 1 -> +10
    Unusual hour (23-5) -> +15
    Burst requests >= 5 -> +20
    Flagged history -> +20
    Clamped to [0, 100]
    """
    confidence = float(features.get("confidence", 95.0))
    failed_attempts = int(features.get("failed_attempts", 0))
    access_hour = int(features.get("access_hour", 14))
    recent_requests = int(features.get("recent_requests", 1))
    suspicious_history = bool(features.get("suspicious_history", False))
    unknown_device = bool(features.get("unknown_device", False))

    score = 20  # Base risk baseline

    if confidence < 60:
        score += 30
    elif confidence < 80:
        score += 15
    elif confidence >= 90:
        score -= 10

    if failed_attempts >= 3:
        score += 25
    elif failed_attempts >= 1:
        score += 10

    if access_hour >= 23 or access_hour <= 5:
        score += 15

    if recent_requests >= 5:
        score += 20
    elif recent_requests >= 3:
        score += 8

    if suspicious_history:
        score += 20

    if unknown_device:
        score += 10

    score = max(0, min(100, score))
    risk_level, policy_action = classify_risk(score)
    risk_factors = generate_risk_factors(
        confidence, failed_attempts, access_hour, recent_requests, suspicious_history, unknown_device
    )
    recommendation = generate_recommendation(risk_level, score)

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "policy_action": policy_action,
        "recommendation": recommendation,
        "risk_factors": risk_factors,
        "confidence": confidence,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

def simulate_verification(
    scenario_mode: str = "auto",
    custom_confidence: float = None,
    image_metadata: Dict[str, Any] = None
) -> Dict[str, Any]:
    """Simulates biometric identity verification with realistic step-by-step logs."""
    if custom_confidence is not None:
        confidence = custom_confidence
        face_detected = confidence > 0
        image_quality = "GOOD" if confidence >= 85 else ("DEGRADED" if confidence >= 60 else "POOR")
        status = "VERIFIED" if confidence >= 60 else "FAILED"
    elif scenario_mode == "safe":
        confidence = 96.0
        face_detected = True
        image_quality = "GOOD"
        status = "VERIFIED"
    elif scenario_mode == "medium":
        confidence = 72.0
        face_detected = True
        image_quality = "DEGRADED"
        status = "VERIFIED"
    elif scenario_mode == "high":
        confidence = 48.0
        face_detected = True
        image_quality = "POOR"
        status = "SUSPICIOUS"
    elif scenario_mode == "failed":
        confidence = 18.0
        face_detected = False
        image_quality = "UNACCEPTABLE"
        status = "FAILED"
    else:  # auto
        confidence = round(random.uniform(92.0, 98.0), 1)
        face_detected = True
        image_quality = "GOOD"
        status = "VERIFIED"

    step_logs = [
        "INITIALIZING VERIFICATION...",
        "Analyzing submitted image...",
        f"Checking optical quality & illumination -> [{image_quality}]",
        f"Facial Landmark Mesh Check -> [{'PASSED' if face_detected else 'NOT DETECTED'}]",
        f"Evaluating identity confidence -> [{confidence}%]",
        "Running AI security analysis...",
        f"VERIFICATION COMPLETE: STATUS [{status}]"
    ]

    return {
        "face_detected": face_detected,
        "image_quality": image_quality,
        "confidence": confidence,
        "status": status,
        "simulation_disclaimer": "Simulated AI-based identity verification developed for academic demonstration.",
        "step_logs": step_logs
    }
