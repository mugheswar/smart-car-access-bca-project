"""
AI Simulation Engine - Intelligent Risk Assessment Module
Academic Demonstration for BCA Final Year Project
NOTE: 100% Local rule-based academic simulation. No cloud or external AI services used.
"""

from typing import Dict, Any, List, Tuple

def classify_risk(risk_score: int) -> Tuple[str, str]:
    """Classify numerical risk score into standard risk tier and access policy."""
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
    """Generate human-readable contributing risk factors for transparency."""
    factors = []
    if confidence < 60:
        factors.append(f"Low identity verification confidence ({confidence:.1f}%)")
    elif confidence < 80:
        factors.append(f"Sub-optimal verification confidence ({confidence:.1f}%)")
    
    if failed_attempts >= 3:
        factors.append(f"Multiple consecutive failed access attempts ({failed_attempts} attempts)")
    elif failed_attempts > 0:
        factors.append(f"Recent failed access attempt recorded ({failed_attempts})")

    if access_hour >= 23 or access_hour <= 5:
        factors.append(f"Unusual access window (Time: {access_hour:02d}:00 hours)")

    if recent_requests >= 5:
        factors.append(f"High frequency of access requests in short time window ({recent_requests} requests)")

    if suspicious_history:
        factors.append("Historical flag: User/Vehicle associated with previous security alerts")

    if unknown_device:
        factors.append("Access request initiated from unrecognized terminal session")

    if not factors:
        factors.append("All baseline security metrics within normal operating bounds")

    return factors

def generate_recommendation(risk_level: str, risk_score: int) -> str:
    """Generate actionable operational recommendation based on computed risk."""
    if risk_level == "low":
        return "Normal security profile. Standard simulated keyless access authorized."
    elif risk_level == "medium":
        return "Elevated risk detected. Secondary identity verification (MFA or Admin clearance) required."
    else:
        return "CRITICAL RISK: Access restricted. Vehicle simulated immobilizer remains active. Security alert dispatched to Admin log."

def calculate_risk_score(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulated Academic AI Risk Engine
    Calculates dynamic risk score (0-100) based on contextual security signals.
    """
    confidence = float(features.get("verification_confidence", 95.0))
    failed_attempts = int(features.get("failed_attempts", 0))
    access_hour = int(features.get("access_hour", 14))
    recent_requests = int(features.get("recent_requests", 1))
    suspicious_history = bool(features.get("suspicious_history", False))
    unknown_device = bool(features.get("unknown_device", False))

    score = 20  # Base security risk baseline

    # Factor 1: Verification Confidence
    if confidence < 60:
        score += 30
    elif confidence < 80:
        score += 15
    elif confidence >= 90:
        score -= 10

    # Factor 2: Failed Attempts
    if failed_attempts >= 3:
        score += 25
    elif failed_attempts >= 1:
        score += 10

    # Factor 3: Time of Access (Night / Off-Hours 11 PM to 5 AM)
    if access_hour >= 23 or access_hour <= 5:
        score += 15

    # Factor 4: Request Burst / Frequency
    if recent_requests >= 5:
        score += 20
    elif recent_requests >= 3:
        score += 8

    # Factor 5: Historical Suspicious Activity
    if suspicious_history:
        score += 20

    # Factor 6: Unknown Device/Terminal
    if unknown_device:
        score += 10

    # Clamp between 0 and 100
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
        "evaluated_at": features.get("timestamp")
    }
