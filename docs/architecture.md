# System Architecture & Technical Specification

## Project: AI-Powered Smart Car Access and Keyless Assistance System
**Degree Program:** Bachelor of Computer Applications (BCA) — Final Year Project  
**Operating Environment:** 100% Local Simulation  
**Disclaimer:** 🔒 *Simulation Mode — No real vehicle control*

---

## 1. Architectural Overview

The Smart Car Access System follows a modern multi-tier decoupled architecture separating presentation, business logic, intelligence modeling, and persistent storage.

```
┌────────────────────────────────────────────────────────┐
│                   React 18 Frontend                    │
│   Vite + TypeScript + Tailwind CSS + Framer Motion    │
│            Runs locally at http://localhost:5173       │
└───────────────────────────┬────────────────────────────┘
                            │ REST API Calls (Axios + Bearer JWT)
                            ▼
┌────────────────────────────────────────────────────────┐
│                    FastAPI Backend                     │
│         Python 3.13 + Uvicorn ASGI Server              │
│            Runs locally at http://localhost:8000       │
├───────────────────────────┬────────────────────────────┤
│  Authentication & RBAC    │  Vehicle Fleet Controller  │
│  Smart Access Workflow    │  Security & Threat Monitor │
└─────────────┬─────────────┴─────────────┬──────────────┘
              │                           │
              ▼                           ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│  AI Simulation Engine     │ │   Local File Storage DB  │
│  • Biometric Simulator    │ │   • users.json           │
│  • Risk Scoring Algorithm │ │   • vehicles.json        │
│  • Scenario Test Matrix   │ │   • access_logs.json     │
│  (Pure local Python)      │ │   • security_events.json │
└───────────────────────────┘ └──────────────────────────┘
```

---

## 2. Component Subsystems

### 2.1 Presentation Tier (Frontend)
- **Framework:** React 18 with Vite bundling and TypeScript strict typing.
- **Styling:** Tailwind CSS with a custom automotive dark palette (`cyber-dark`, `cyber-card`, `cyan-accent`).
- **Telemetry Visuals:** Interactive vector SVG vehicle graphics reflecting dynamic headlight state, latch status, and underbody glow.
- **Data Visualizations:** Recharts for fleet distribution, risk evaluation tiers, and access frequencies.
- **State Animations:** Framer Motion for state transitions (`REQUEST` → `VERIFY` → `ANALYZE` → `DECISION` → `UNLOCKED`).

### 2.2 Application Tier (Backend)
- **FastAPI (ASGI):** High-throughput Python web framework utilizing Pydantic v2 schemas.
- **Authentication:** Stateless JSON Web Tokens (JWT) signed via HS256 algorithm with configurable expiration.
- **Password Cryptography:** NIST-compliant PBKDF2-HMAC-SHA256 password hashing with 100,000 rounds and random salt.
- **Role-Based Access Control (RBAC):** Distinct authorization tiers for `user` and `admin` roles, including safeguards preventing administrators from self-deactivation.

### 2.3 Local Storage Database Tier
- **Engine:** Document-oriented JSON Local File Storage system in `backend/data/`.
- **Concurrency:** Thread-safe reentrant file locking (`threading.RLock`) with atomic write replacements.
- **Collection Interfaces:**
  - `users.json`: Identity and role credentials.
  - `vehicles.json`: Registered Indian vehicle telematics and lock states.
  - `access_logs.json`: Chronological audit trail of access requests, confidence scores, and risk classifications.
  - `security_events.json`: Intrusion alarms and high-risk anomalies.
  - `notifications.json`: Push event records.

### 2.4 Hidden AI Simulation Subsystem
- **Scope:** Pure local academic simulation modeling biometric verification and contextual risk scoring.
- **Zero GPU / Zero Cloud:** Operates without external machine learning APIs or cloud services.
- **Simulation Formula:**
  $$\text{Risk} = \text{Clamp}_{0}^{100}\Big(20 + \Delta_{\text{confidence}} + \Delta_{\text{failures}} + \Delta_{\text{hour}} + \Delta_{\text{burst}} + \Delta_{\text{history}}\Big)$$
- **Tiers:**
  - `0 - 30`: Low Risk → Simulated Access Granted
  - `31 - 70`: Medium Risk → Additional Verification Required
  - `71 - 100`: High Risk → Simulated Access Denied & Security Incident Dispatched

---

## 3. Physical Non-Actuation & Safety Boundaries
- **Strictly Software Simulation:** The application does not interface with CAN bus, OBD-II ports, physical relay switches, solenoids, or wireless transceivers.
- **Permanent Visual Indicators:** Every console view permanently displays the simulation disclaimer badge.
- **Deterministic State Machines:** Access state modifications affect only database documents and UI telemetry.
