"""
Predefined Academic Demonstration Scenarios
Enables examiners and evaluators to test deterministic risk assessment tiers easily.
"""

from typing import Dict, Any

DEMO_SCENARIOS: Dict[str, Dict[str, Any]] = {
    "safe": {
        "id": "safe",
        "title": "Scenario A: Trusted Owner Access (Low Risk)",
        "description": "Registered owner attempting unlock during normal daytime hours with high verification confidence.",
        "verification_confidence": 96.0,
        "failed_attempts": 0,
        "access_hour": 10,
        "access_time_display": "10:30 AM",
        "recent_requests": 1,
        "suspicious_history": False,
        "unknown_device": False,
        "expected_risk_level": "low",
        "expected_action": "Simulated Access Granted"
    },
    "medium": {
        "id": "medium",
        "title": "Scenario B: Elevated Ambiguity (Medium Risk)",
        "description": "Access attempt late at night with reduced image confidence and multiple attempts.",
        "verification_confidence": 72.0,
        "failed_attempts": 1,
        "access_hour": 23,
        "access_time_display": "11:45 PM",
        "recent_requests": 3,
        "suspicious_history": False,
        "unknown_device": False,
        "expected_risk_level": "medium",
        "expected_action": "Additional Verification Required"
    },
    "high": {
        "id": "high",
        "title": "Scenario C: Critical Anomaly / Intrusion Attempt (High Risk)",
        "description": "Multiple failed attempts in the early morning hours with low confidence and flagged vehicle history.",
        "verification_confidence": 48.0,
        "failed_attempts": 4,
        "access_hour": 2,
        "access_time_display": "02:15 AM",
        "recent_requests": 7,
        "suspicious_history": True,
        "unknown_device": True,
        "expected_risk_level": "high",
        "expected_action": "Simulated Access Denied — Security Event Created"
    }
}

def get_scenario(scenario_id: str) -> Dict[str, Any]:
    return DEMO_SCENARIOS.get(scenario_id.lower(), DEMO_SCENARIOS["safe"])
