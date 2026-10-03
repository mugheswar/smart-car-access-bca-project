"""
Backend API and AI Simulation Integration Tests
Tests authentication, vehicle CRUD, AI risk scoring, smart access workflow, and admin safeguards.
"""

import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.main import app
from app.database import db

client = TestClient(app)

def test_root_disclaimer():
    """Verify simulation disclaimer is prominently returned by root."""
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert "Simulation Mode" in data["simulationDisclaimer"]

def test_login_demo_user():
    """Verify demo user login and JWT token generation."""
    res = client.post("/api/auth/login", json={
        "email": "user@smartcar.local",
        "password": "User@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "user@smartcar.local"
    assert data["user"]["role"] == "user"

def test_login_admin_user():
    """Verify admin user login and role assertion."""
    res = client.post("/api/auth/login", json={
        "email": "admin@smartcar.local",
        "password": "Admin@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "admin"

def test_registration_and_duplicate_check():
    """Verify user registration and rejection of duplicate email."""
    test_email = "testnewuser@smartcar.local"
    db.users.delete_one({"email": test_email})

    reg_payload = {
        "name": "New Tester",
        "email": test_email,
        "phone": "+91 99999 88888",
        "password": "Password@123",
        "confirm_password": "Password@123"
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 200
    assert res.json()["user"]["email"] == test_email

    # Duplicate check
    res_dup = client.post("/api/auth/register", json=reg_payload)
    assert res_dup.status_code == 400
    assert "already exists" in res_dup.json()["detail"]

def test_vehicle_management_crud():
    """Test creating, reading, updating, and deleting a vehicle."""
    # Login user
    login_res = client.post("/api/auth/login", json={"email": "user@smartcar.local", "password": "User@123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Get vehicles
    get_res = client.get("/api/vehicles", headers=headers)
    assert get_res.status_code == 200
    assert len(get_res.json()) >= 1

    # 2. Create vehicle
    create_payload = {
        "registrationNumber": "KA 01 TEST 9999",
        "brand": "Tata",
        "model": "Harrier",
        "type": "SUV",
        "year": 2025,
        "color": "Calypso Red"
    }
    create_res = client.post("/api/vehicles", json=create_payload, headers=headers)
    assert create_res.status_code == 201
    veh_id = create_res.json()["id"]

    # 3. Update vehicle
    update_res = client.put(f"/api/vehicles/{veh_id}", json={"color": "Atlas Black"}, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["color"] == "Atlas Black"

    # 4. Delete vehicle
    del_res = client.delete(f"/api/vehicles/{veh_id}", headers=headers)
    assert del_res.status_code == 200

def test_ai_simulation_scenarios():
    """Test AI simulation engine across Safe, Medium, and High scenarios."""
    login_res = client.post("/api/auth/login", json={"email": "user@smartcar.local", "password": "User@123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Safe Scenario (Confidence 96%, Low Risk)
    safe_pred = client.post("/api/ai/risk-predict", json={
        "confidence": 96.0,
        "failed_attempts": 0,
        "access_hour": 11,
        "recent_requests": 1,
        "suspicious_history": False
    }, headers=headers)
    assert safe_pred.status_code == 200
    assert safe_pred.json()["risk_level"] == "low"
    assert safe_pred.json()["risk_score"] <= 30

    # High Scenario (Confidence 48%, Failed 4, Night hour 2 -> High Risk)
    high_pred = client.post("/api/ai/risk-predict", json={
        "confidence": 48.0,
        "failed_attempts": 4,
        "access_hour": 2,
        "recent_requests": 7,
        "suspicious_history": True
    }, headers=headers)
    assert high_pred.status_code == 200
    assert high_pred.json()["risk_level"] == "high"
    assert high_pred.json()["risk_score"] >= 71

def test_full_smart_access_workflow():
    """
    Test end-to-end access workflow:
    LOCKED -> ACCESS REQUESTED -> VERIFIED -> ANALYZE -> UNLOCKED -> LOCKED
    """
    login_res = client.post("/api/auth/login", json={"email": "user@smartcar.local", "password": "User@123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Pick vehicle
    veh = db.vehicles.find_one({"registrationNumber": "TN 07 CS 4921"})
    assert veh is not None
    veh_id = veh["_id"]

    # 1. Request access
    req_res = client.post("/api/access/request", json={"vehicleId": veh_id, "scenarioMode": "safe"}, headers=headers)
    assert req_res.status_code == 200
    assert req_res.json()["status"] == "access_requested"

    # 2. Verify identity simulation
    ver_res = client.post("/api/access/verify", json={"vehicleId": veh_id, "scenarioMode": "safe"}, headers=headers)
    assert ver_res.status_code == 200
    assert ver_res.json()["verification"]["status"] == "VERIFIED"
    assert ver_res.json()["verification"]["confidence"] >= 90

    # 3. Analyze security
    ana_res = client.post("/api/access/analyze", json={
        "vehicleId": veh_id,
        "scenarioMode": "safe",
        "confidence": 96.0,
        "failedAttempts": 0,
        "accessHour": 10
    }, headers=headers)
    assert ana_res.status_code == 200
    assert ana_res.json()["riskLevel"] == "low"
    assert ana_res.json()["accessStatus"] == "granted"

    # 4. Simulate unlock
    unl_res = client.post("/api/access/simulate-unlock", json={"vehicleId": veh_id}, headers=headers)
    assert unl_res.status_code == 200
    assert unl_res.json()["status"] == "unlocked"

    # 5. Simulate lock
    lock_res = client.post("/api/access/simulate-lock", json={"vehicleId": veh_id}, headers=headers)
    assert lock_res.status_code == 200
    assert lock_res.json()["status"] == "locked"

def test_admin_portal_and_safeguards():
    """Verify admin endpoints and safeguard preventing admin self-deactivation."""
    # 1. Regular user trying admin endpoint should be forbidden
    user_res = client.post("/api/auth/login", json={"email": "user@smartcar.local", "password": "User@123"})
    user_headers = {"Authorization": f"Bearer {user_res.json()['access_token']}"}
    stat_forbidden = client.get("/api/admin/statistics", headers=user_headers)
    assert stat_forbidden.status_code == 403

    # 2. Admin user accessing statistics
    admin_res = client.post("/api/auth/login", json={"email": "admin@smartcar.local", "password": "Admin@123"})
    admin_headers = {"Authorization": f"Bearer {admin_res.json()['access_token']}"}
    stat_res = client.get("/api/admin/statistics", headers=admin_headers)
    assert stat_res.status_code == 200
    assert "overview" in stat_res.json()

    # 3. Self-deactivation safeguard
    admin_id = admin_res.json()["user"]["id"]
    toggle_self = client.put(f"/api/admin/users/{admin_id}/toggle-status", headers=admin_headers)
    assert toggle_self.status_code == 400
    assert "Safety Precaution" in toggle_self.json()["detail"]
