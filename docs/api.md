# REST API Specification

**Base URL:** `http://localhost:8000`  
**Authentication Scheme:** HTTP Bearer Header (`Authorization: Bearer <token>`)

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register Account
- **Method:** `POST /api/auth/register`
- **Request Body:**
```json
{
  "name": "Aditya Sharma",
  "email": "user@smartcar.local",
  "phone": "+91 91234 56789",
  "password": "User@123",
  "confirm_password": "User@123"
}
```
- **Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": {
    "id": "user-demo-002",
    "name": "Aditya Sharma",
    "email": "user@smartcar.local",
    "phone": "+91 91234 56789",
    "role": "user",
    "status": "active",
    "createdAt": "2026-09-13T05:00:00Z"
  }
}
```

### 1.2 Login Account
- **Method:** `POST /api/auth/login`
- **Request Body:**
```json
{
  "email": "user@smartcar.local",
  "password": "User@123"
}
```
- **Response (200 OK):** TokenResponse with JWT token and user profile.

### 1.3 Get Current User Profile
- **Method:** `GET /api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** UserResponse.

---

## 2. Vehicle Telematics Endpoints (`/api/vehicles`)

### 2.1 Get Registered Vehicles
- **Method:** `GET /api/vehicles`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** Array of vehicles belonging to user (or all vehicles if caller is Admin).

### 2.2 Register New Vehicle
- **Method:** `POST /api/vehicles`
- **Request Body:**
```json
{
  "registrationNumber": "TN 07 CS 4921",
  "brand": "Hyundai",
  "model": "Creta",
  "type": "SUV",
  "year": 2025,
  "color": "Polar White"
}
```

### 2.3 Update Vehicle
- **Method:** `PUT /api/vehicles/{id}`
- **Request Body:** Partial vehicle fields.

### 2.4 Delete Vehicle
- **Method:** `DELETE /api/vehicles/{id}`

---

## 3. Smart Access Workflow Endpoints (`/api/access`)

### 3.1 Request Keyless Access
- **Method:** `POST /api/access/request`
- **Request Body:**
```json
{
  "vehicleId": "veh-creta-001",
  "scenarioMode": "safe"
}
```
- **State Transition:** `LOCKED` → `ACCESS REQUESTED`

### 3.2 Verify Identity Simulation
- **Method:** `POST /api/access/verify`
- **Request Body:**
```json
{
  "vehicleId": "veh-creta-001",
  "scenarioMode": "safe",
  "customConfidence": 96.5
}
```
- **Response:**
```json
{
  "success": true,
  "verification": {
    "face_detected": true,
    "image_quality": "GOOD",
    "confidence": 96.5,
    "status": "VERIFIED",
    "step_logs": ["INITIALIZING VERIFICATION...", "Analyzing image...", "VERIFICATION COMPLETE: STATUS [VERIFIED]"]
  }
}
```

### 3.3 Analyze Security Risk
- **Method:** `POST /api/access/analyze`
- **Request Body:**
```json
{
  "vehicleId": "veh-creta-001",
  "scenarioMode": "safe",
  "confidence": 96.5,
  "failedAttempts": 0,
  "accessHour": 10
}
```
- **Response:**
```json
{
  "accessLogId": "log-001",
  "riskScore": 10,
  "riskLevel": "low",
  "accessStatus": "granted",
  "policyAction": "Simulated Access Granted",
  "recommendation": "Standard authorization approved. Simulated door latch unlocked.",
  "riskFactors": ["All baseline security metrics within normal operating bounds"]
}
```

### 3.4 Simulate Unlock
- **Method:** `POST /api/access/simulate-unlock`
- **Request Body:** `{"vehicleId": "veh-creta-001"}`
- **State Transition:** `ACCESS REQUESTED` → `SIMULATED UNLOCKED`

### 3.5 Simulate Lock
- **Method:** `POST /api/access/simulate-lock`
- **Request Body:** `{"vehicleId": "veh-creta-001"}`
- **State Transition:** `UNLOCKED` → `LOCKED`

### 3.6 Access History Query
- **Method:** `GET /api/access/history?page=1&limit=10&status=all&riskLevel=all&search=Creta`

---

## 4. AI Simulation Endpoints (`/api/ai`)
- `POST /api/ai/verify`: Standalone verification simulator
- `POST /api/ai/risk-predict`: Standalone contextual risk evaluator
- `GET /api/ai/scenarios`: Returns predefined demo scenarios (Safe, Medium, High)
- `GET /api/ai/statistics`: Aggregate model analytics for Recharts

---

## 5. Security & Threat Monitoring Endpoints (`/api/security`)
- `GET /api/security/events`: List anomalous access attempts
- `PUT /api/security/events/{id}/review`: Mark event as reviewed
- `GET /api/security/alerts`: List system notifications
- `GET /api/security/score`: Current AI security trust score calculation

---

## 6. Administration Endpoints (`/api/admin`)
- `GET /api/admin/users`: Enumerate all registered accounts
- `PUT /api/admin/users/{id}/toggle-status`: Enable or disable account (with self-deactivation protection)
- `GET /api/admin/vehicles`: Complete fleet telematics overview
- `DELETE /api/admin/vehicles/{id}`: Administrative fleet deletion
- `GET /api/admin/access-logs`: Global system audit logs
- `GET /api/admin/statistics`: Fleet overview, daily access trend, and risk distribution
