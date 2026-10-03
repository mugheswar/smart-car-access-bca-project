# 🚗 AI-Powered Smart Car Access and Keyless Assistance System

> 🔒 **Simulation Mode — No real vehicle control**  
> *"A simulated AI-based identity verification and risk assessment module developed for academic demonstration."*  
> **BCA Final Year Project** • 100% Local Software Simulation • Zero Cloud or Hardware Dependencies

---

## 📋 Table of Contents
1. [Abstract](#abstract)
2. [Introduction](#introduction)
3. [Problem Statement](#problem-statement)
4. [Existing System](#existing-system)
5. [Proposed System](#proposed-system)
6. [Objectives](#objectives)
7. [Features](#features)
8. [Technology Stack](#technology-stack)
9. [System Architecture](#system-architecture)
10. [Modules](#modules)
11. [AI Simulation Methodology](#ai-simulation-methodology)
12. [Database Design (Local File Storage)](#database-design)
13. [API Documentation](#api-documentation)
14. [Installation & Setup](#installation--setup)
15. [Demo Credentials](#demo-credentials)
16. [Step-by-Step Live Demo Instructions](#demo-instructions)
17. [Testing](#testing)
18. [Advantages & Limitations](#advantages--limitations)
19. [Future Scope](#future-scope)
20. [Conclusion](#conclusion)

---

## 📖 Abstract
The **AI-Powered Smart Car Access and Keyless Assistance System** is an advanced automotive telematics platform designed as a complete, safe, and modern **software simulation** for a BCA Final Year Project. It simulates contactless, intelligent vehicle entry using local rule-based AI risk scoring and simulated biometric identity verification. The application operates entirely locally on a student's laptop without cloud deployment, external database daemons, GPUs, or real automotive actuator hardware.

---

## 🚘 Safety & Simulation Disclaimer
This project is **100% software simulation**:
- **NEVER** connects to real vehicle door locks, ignition, immobilizers, CAN bus, OBD hardware, or BLE/NFC relays.
- **NEVER** connects to cloud AI APIs (OpenAI, Gemini, Claude) or real biometric face databases.
- Clicking "Unlock Vehicle" changes **only** application and database state.
- Permanently displays: `🔒 Simulation Mode — No real vehicle control`.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide React, Axios |
| **Backend** | Python 3.13, FastAPI, Uvicorn (ASGI), Pydantic v2, PyJWT, PBKDF2-HMAC-SHA256 |
| **Database** | Thread-Safe Local Document File Storage (`backend/data/*.json`) — Zero external database daemon setup |
| **AI Simulation** | Pure Local Python Rule-Based Risk Engine (`ai_simulation/` & `backend/app/services/`) |

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React 18 Frontend                    │
│            Runs locally at http://localhost:5173       │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (Bearer JWT)
                            ▼
┌────────────────────────────────────────────────────────┐
│                    FastAPI Backend                     │
│            Runs locally at http://localhost:8000       │
├───────────────────────────┬────────────────────────────┤
│  Authentication (RBAC)    │  Smart Access Workflow     │
│  Vehicle Telematics CRUD  │  Threat Alert Monitoring   │
└─────────────┬─────────────┴─────────────┬──────────────┘
              │                           │
              ▼                           ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│  AI Simulation Engine     │ │  Local File Storage DB   │
│  • Biometric Verification │ │  • users.json            │
│  • Contextual Risk Matrix │ │  • vehicles.json         │
│  • Scenarios (Safe/Med/Hi)│ │  • access_logs.json      │
└───────────────────────────┘ └──────────────────────────┘
```

---

## ⚡ Quick Start Installation

### Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ and npm

### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python ../database/seed.py
python -m uvicorn app.main:app --reload --port 8000
```
Backend API will be live at: **http://localhost:8000**  
Interactive Swagger docs: **http://localhost:8000/docs**

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend UI will be live at: **http://localhost:5173**

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Demo User** | `user@smartcar.local` | `User@123` | Dashboard, Vehicle Management, Smart Access Console, AI Risk Sandbox, Access Logs |
| **System Admin** | `admin@smartcar.local` | `Admin@123` | Admin Analytics, User Directory (Toggle Status), Fleet Telematics, Global Audit Ledger |

> 💡 *Tip:* The login page features a **Quick Examiner Auto-Fill** button that populates credentials with a single click.

---

## 🎯 Step-by-Step Live Demo Instructions

1. **Launch Application:** Open `http://localhost:5173` in any modern web browser.
2. **Review Landing Page:** Observe the SVG automotive visual, 5-stage workflow, and future roadmap.
3. **Log In:** Click "Sign In" and use the **Demo User** button (`user@smartcar.local`).
4. **Dashboard:** Inspect the circular **AI SECURITY SCORE (92 / 100 LOW RISK)** and vehicle status card.
5. **Explore Smart Access Console:**
   - Go to **Smart Access Console**.
   - Notice the selected Indian vehicle (**Hyundai Creta — Polar White — TN 07 CS 4921**).
   - Test **Scenario A (🟢 SAFE)**:
     1. Click `01 REQUEST ACCESS` → Vehicle transitions to `ACCESS REQUESTED`.
     2. Click `02 RUN IDENTITY VERIFICATION` → View simulated facial mesh scanning and confidence (96%).
     3. Click `03 EXECUTE AI RISK ASSESSMENT` → Risk score computed as **10/100 (LOW RISK)**.
     4. Click `05 SIMULATE UNLOCK VEHICLE` → Door latch unlocks with visual confirmation: `✓ Access Granted — Simulation`.
   - Test **Scenario C (🔴 HIGH)** using the Examiner Scenario Selector:
     1. Observe confidence drops to 48% with 4 failed attempts at 02:15 AM.
     2. Risk score evaluates to **88/100 (HIGH RISK)**.
     3. Outcome: **SIMULATED ACCESS DENIED** and a security incident is automatically dispatched to the admin log.
6. **AI Insights:** Navigate to **AI Risk Engine** and use the interactive sliders to dynamically test the algorithm.
7. **Switch to Admin:** Click the **Demo Mode** dropdown in the top navbar and switch to **System Admin**.
8. **Admin Analytics:** View Recharts time-series charts, user account management, and global audit trails.

---

## 🧪 Testing

Run backend tests using `pytest`:
```bash
python -m pytest tests/test_backend.py -v
```
*(All 8 integration test suites pass with 100% compliance).*

Build and verify frontend TypeScript:
```bash
cd frontend
npm run build
```
*(Compiles cleanly with 0 errors).*

---

## 📁 Project Structure

```
smart-car-access/
├── frontend/                     # React 18 + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components & CarVisual SVG
│   │   ├── context/              # Auth & Toast context providers
│   │   ├── layouts/              # MainLayout with Sidebar and Navbar
│   │   ├── pages/                # All application views & Admin portal
│   │   ├── services/             # Axios API client services
│   │   └── types/                # TypeScript type definitions
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                      # FastAPI Python backend
│   ├── app/
│   │   ├── main.py               # Application entrypoint & CORS
│   │   ├── config.py             # Pydantic environment settings
│   │   ├── database.py           # Thread-safe JSON Local File Storage
│   │   ├── routes/               # Auth, Vehicles, Access, AI, Security, Admin
│   │   ├── schemas/              # Pydantic request/response models
│   │   ├── services/             # AI Simulator & Risk Scoring engine
│   │   └── utils/                # PBKDF2 password hashing & JWT helpers
│   ├── data/                     # Persistent JSON files (auto-seeded)
│   └── requirements.txt
│
├── ai_simulation/                # Pure local academic AI engine modules
│   ├── risk_engine.py
│   ├── verification_simulator.py
│   └── scenarios.py
│
├── database/
│   └── seed.py                   # Reset & seeding script
│
├── tests/
│   └── test_backend.py           # Pytest integration tests
│
├── docs/                         # BCA Final Year Project Documentation
│   ├── architecture.md
│   ├── api.md
│   ├── diagrams.md               # Mermaid diagrams (ER, DFD, Architecture)
│   └── project-report.md         # Full 27-section academic report
│
├── README.md
└── .gitignore
```

---

## 🎓 Academic Viva Highlights
- **100% Local Simulation:** Safe, cost-free, and deterministic.
- **Zero Heavy ML Bloat:** Runs effortlessly on any standard laptop without requiring PyTorch, TensorFlow, or a discrete GPU.
- **Local Storage:** Eliminates external MongoDB server installation issues.
- **Automotive Telematics:** Demonstrates realistic smart car access security concepts suitable for college defense.
