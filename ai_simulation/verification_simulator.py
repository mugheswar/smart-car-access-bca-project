"""
Simulated Identity Verification Module
Academic Demonstration for BCA Final Year Project
NOTE: This module strictly simulates identity verification for software testing and demonstration.
NO real biometric data or real facial recognition APIs are utilized.
"""

from typing import Dict, Any, List
import random

def simulate_verification(
    scenario_mode: str = "auto",
    custom_confidence: float = None,
    client_metadata: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Simulates intelligent camera/photo biometric verification.
    Supported scenarios: 'safe', 'medium', 'high', 'failed', 'auto'
    """
    client_metadata = client_metadata or {}
    
    if scenario_mode == "safe":
        confidence = custom_confidence if custom_confidence is not None else 96.0
        face_detected = True
        image_quality = "EXCELLENT"
        liveness_score = 98.5
        status = "VERIFIED"
    elif scenario_mode == "medium":
        confidence = custom_confidence if custom_confidence is not None else 72.0
        face_detected = True
        image_quality = "DEGRADED"
        liveness_score = 75.0
        status = "ADDITIONAL_VERIFICATION"
    elif scenario_mode == "high":
        confidence = custom_confidence if custom_confidence is not None else 48.0
        face_detected = True
        image_quality = "POOR"
        liveness_score = 52.0
        status = "SUSPICIOUS"
    elif scenario_mode == "failed":
        confidence = 18.0
        face_detected = False
        image_quality = "UNACCEPTABLE"
        liveness_score = 20.0
        status = "FAILED"
    else:  # auto/default
        confidence = custom_confidence if custom_confidence is not None else round(random.uniform(91.0, 98.0), 1)
        face_detected = True
        image_quality = "GOOD"
        liveness_score = 95.0
        status = "VERIFIED"

    step_logs: List[str] = [
        "INITIALIZING VERIFICATION PIPELINE...",
        "Analyzing submitted biometric frame...",
        f"Checking optical quality & illumination -> [{image_quality}]",
        f"Facial Landmark Mesh Check -> [{'Passed' if face_detected else 'No Face Detected'}]",
        f"Passive Liveness Analysis -> [{liveness_score}% confidence]",
        f"Simulated Biometric Match Confidence -> [{confidence}%]",
        f"VERIFICATION COMPLETE: STATUS [{status}]"
    ]

    return {
        "face_detected": face_detected,
        "image_quality": image_quality,
        "liveness_score": liveness_score,
        "confidence": confidence,
        "status": status,
        "simulation_disclaimer": "Simulated AI-based identity verification for academic demonstration.",
        "step_logs": step_logs
    }
