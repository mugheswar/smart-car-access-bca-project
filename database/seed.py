"""
Database Seeding Script for Smart Car Access System
Seeds Admin, Demo User, Indian Demo Vehicles, Access Logs, Security Events, and Notifications.
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta, timezone

# Add backend directory to sys.path so app imports work
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.database import db
from app.utils.security import hash_password

def seed_database(reset: bool = True):
    print("[*] Starting database seeding (Local File Storage)...")

    if reset:
        db.users.delete_many()
        db.vehicles.delete_many()
        db.access_logs.delete_many()
        db.security_events.delete_many()
        db.notifications.delete_many()

    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()

    # 1. Users
    admin_user = {
        "_id": "user-admin-001",
        "name": "System Administrator",
        "email": "admin@smartcar.local",
        "phone": "+91 98765 43210",
        "passwordHash": hash_password("Admin@123"),
        "role": "admin",
        "status": "active",
        "createdAt": (now - timedelta(days=30)).isoformat()
    }

    demo_user = {
        "_id": "user-demo-002",
        "name": "Aditya Sharma",
        "email": "user@smartcar.local",
        "phone": "+91 91234 56789",
        "passwordHash": hash_password("User@123"),
        "role": "user",
        "status": "active",
        "createdAt": (now - timedelta(days=20)).isoformat()
    }

    db.users.insert_one(admin_user)
    db.users.insert_one(demo_user)
    print("[+] Seeded Users (Admin & Demo User)")

    # 2. Indian Demo Vehicles
    vehicles = [
        {
            "_id": "veh-creta-001",
            "ownerId": demo_user["_id"],
            "registrationNumber": "TN 07 CS 4921",
            "brand": "Hyundai",
            "model": "Creta",
            "type": "SUV",
            "year": 2025,
            "color": "Polar White",
            "status": "locked",
            "createdAt": (now - timedelta(days=15)).isoformat(),
            "securityScore": 96,
            "lastAccess": (now - timedelta(minutes=45)).isoformat()
        },
        {
            "_id": "veh-nexon-002",
            "ownerId": demo_user["_id"],
            "registrationNumber": "MH 12 QX 8832",
            "brand": "Tata",
            "model": "Nexon",
            "type": "Compact SUV",
            "year": 2024,
            "color": "Flame Red",
            "status": "locked",
            "createdAt": (now - timedelta(days=12)).isoformat(),
            "securityScore": 92,
            "lastAccess": (now - timedelta(hours=4)).isoformat()
        },
        {
            "_id": "veh-xuv-003",
            "ownerId": demo_user["_id"],
            "registrationNumber": "KA 05 MN 1099",
            "brand": "Mahindra",
            "model": "XUV700",
            "type": "Luxury SUV",
            "year": 2025,
            "color": "Midnight Black",
            "status": "locked",
            "createdAt": (now - timedelta(days=10)).isoformat(),
            "securityScore": 94,
            "lastAccess": (now - timedelta(days=1)).isoformat()
        },
        {
            "_id": "veh-swift-004",
            "ownerId": demo_user["_id"],
            "registrationNumber": "DL 03 CA 5541",
            "brand": "Maruti Suzuki",
            "model": "Swift",
            "type": "Hatchback",
            "year": 2024,
            "color": "Pearl Arctic White",
            "status": "locked",
            "createdAt": (now - timedelta(days=8)).isoformat(),
            "securityScore": 90,
            "lastAccess": (now - timedelta(days=2)).isoformat()
        }
    ]

    for v in vehicles:
        db.vehicles.insert_one(v)
    print("[+] Seeded Indian Demo Vehicles (Creta, Nexon, XUV700, Swift)")

    # 3. Access Logs (Safe, Medium, and High-Risk attempts)
    access_logs = [
        {
            "_id": "log-001",
            "userId": demo_user["_id"],
            "userName": demo_user["name"],
            "vehicleId": "veh-creta-001",
            "vehicleName": "Hyundai Creta",
            "registrationNumber": "TN 07 CS 4921",
            "verificationStatus": "verified",
            "confidence": 96.5,
            "riskScore": 10,
            "riskLevel": "low",
            "accessStatus": "granted",
            "policyAction": "Simulated Access Granted",
            "recommendation": "Standard authorization approved. Simulated door latch unlocked.",
            "riskFactors": ["All baseline security metrics within normal operating bounds"],
            "timestamp": (now - timedelta(minutes=45)).isoformat()
        },
        {
            "_id": "log-002",
            "userId": demo_user["_id"],
            "userName": demo_user["name"],
            "vehicleId": "veh-nexon-002",
            "vehicleName": "Tata Nexon",
            "registrationNumber": "MH 12 QX 8832",
            "verificationStatus": "verified",
            "confidence": 94.0,
            "riskScore": 12,
            "riskLevel": "low",
            "accessStatus": "granted",
            "policyAction": "Simulated Access Granted",
            "recommendation": "Normal security profile. Standard simulated keyless access authorized.",
            "riskFactors": ["All baseline security metrics within normal operating bounds"],
            "timestamp": (now - timedelta(hours=4)).isoformat()
        },
        {
            "_id": "log-003",
            "userId": demo_user["_id"],
            "userName": demo_user["name"],
            "vehicleId": "veh-xuv-003",
            "vehicleName": "Mahindra XUV700",
            "registrationNumber": "KA 05 MN 1099",
            "verificationStatus": "verified",
            "confidence": 72.0,
            "riskScore": 54,
            "riskLevel": "medium",
            "accessStatus": "pending_verification",
            "policyAction": "Additional Verification Required",
            "recommendation": "Elevated risk detected. Secondary identity verification required.",
            "riskFactors": [
                "Sub-optimal verification confidence (72.0%)",
                "Unusual access window (Time: 23:00 hours)",
                "Recent failed access attempt recorded (1)"
            ],
            "timestamp": (now - timedelta(hours=14)).isoformat()
        },
        {
            "_id": "log-004",
            "userId": demo_user["_id"],
            "userName": demo_user["name"],
            "vehicleId": "veh-creta-001",
            "vehicleName": "Hyundai Creta",
            "registrationNumber": "TN 07 CS 4921",
            "verificationStatus": "suspicious",
            "confidence": 48.0,
            "riskScore": 88,
            "riskLevel": "high",
            "accessStatus": "denied",
            "policyAction": "Simulated Access Denied",
            "recommendation": "CRITICAL RISK: Access restricted. Vehicle simulated immobilizer remains active. Security alert dispatched to Admin log.",
            "riskFactors": [
                "Low identity verification confidence (48.0%)",
                "Multiple consecutive failed access attempts (4 attempts)",
                "Unusual access window (Time: 02:00 hours)",
                "High frequency of access requests in short time window (7 requests)",
                "Historical flag: User/Vehicle associated with previous security alerts"
            ],
            "timestamp": (now - timedelta(days=1, hours=8)).isoformat()
        },
        {
            "_id": "log-005",
            "userId": demo_user["_id"],
            "userName": demo_user["name"],
            "vehicleId": "veh-swift-004",
            "vehicleName": "Maruti Suzuki Swift",
            "registrationNumber": "DL 03 CA 5541",
            "verificationStatus": "verified",
            "confidence": 98.0,
            "riskScore": 8,
            "riskLevel": "low",
            "accessStatus": "granted",
            "policyAction": "Simulated Access Granted",
            "recommendation": "Normal security profile. Standard simulated keyless access authorized.",
            "riskFactors": ["All baseline security metrics within normal operating bounds"],
            "timestamp": (now - timedelta(days=2)).isoformat()
        }
    ]

    for log in access_logs:
        db.access_logs.insert_one(log)
    print("[+] Seeded Access Logs (Low, Medium, and High Risk demonstration logs)")

    # 4. Security Events
    security_events = [
        {
            "_id": "sec-001",
            "userId": demo_user["_id"],
            "userName": demo_user["name"],
            "vehicleId": "veh-creta-001",
            "vehicleInfo": "Hyundai Creta (TN 07 CS 4921)",
            "eventType": "unauthorized_high_risk_access_attempt",
            "severity": "high",
            "description": "Simulated access denied due to critical risk score (88/100). Off-hours burst request (02:15 AM) with 4 consecutive failures.",
            "riskScore": 88,
            "timestamp": (now - timedelta(days=1, hours=8)).isoformat(),
            "status": "active"
        },
        {
            "_id": "sec-002",
            "userId": demo_user["_id"],
            "userName": demo_user["name"],
            "vehicleId": "veh-xuv-003",
            "vehicleInfo": "Mahindra XUV700 (KA 05 MN 1099)",
            "eventType": "elevated_risk_access_requested",
            "severity": "medium",
            "description": "Additional biometric authentication requested due to degraded confidence score (72%) at 11:45 PM.",
            "riskScore": 54,
            "timestamp": (now - timedelta(hours=14)).isoformat(),
            "status": "reviewed"
        },
        {
            "_id": "sec-003",
            "userId": demo_user["_id"],
            "userName": demo_user["name"],
            "vehicleId": "veh-nexon-002",
            "vehicleInfo": "Tata Nexon (MH 12 QX 8832)",
            "eventType": "unrecognized_device_access",
            "severity": "low",
            "description": "New browser session fingerprint detected for vehicle access request. Successfully passed biometric verification.",
            "riskScore": 28,
            "timestamp": (now - timedelta(days=3)).isoformat(),
            "status": "resolved"
        }
    ]

    for sec in security_events:
        db.security_events.insert_one(sec)
    print("[+] Seeded Security Events")

    # 5. Notifications
    notifications = [
        {
            "_id": "notif-001",
            "userId": demo_user["_id"],
            "title": "Simulated Vehicle Unlocked",
            "message": "Hyundai Creta (TN 07 CS 4921) door latch unlocked successfully via AI keyless verification.",
            "type": "success",
            "timestamp": (now - timedelta(minutes=45)).isoformat(),
            "read": False
        },
        {
            "_id": "notif-002",
            "userId": demo_user["_id"],
            "title": "Security Alert: Access Blocked",
            "message": "High-risk access attempt blocked on Hyundai Creta. Anomaly detected at 02:15 AM.",
            "type": "danger",
            "timestamp": (now - timedelta(days=1, hours=8)).isoformat(),
            "read": False
        },
        {
            "_id": "notif-003",
            "userId": demo_user["_id"],
            "title": "Verification Notice",
            "message": "Additional verification was prompted for Mahindra XUV700 due to night-time access.",
            "type": "warning",
            "timestamp": (now - timedelta(hours=14)).isoformat(),
            "read": True
        }
    ]

    for n in notifications:
        db.notifications.insert_one(n)
    print("[+] Seeded Notifications")

    print("\n[OK] Database seeding completed successfully!")
    print(f"[*] Admin login: admin@smartcar.local / Admin@123")
    print(f"[*] Demo User login: user@smartcar.local / User@123")
    print(f"[*] Local Storage Directory: {db.data_dir}\n")

if __name__ == "__main__":
    seed_database(reset=True)
