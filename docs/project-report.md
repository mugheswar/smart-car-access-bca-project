# Project Report: AI-Powered Smart Car Access and Keyless Assistance System

**Academic Qualification:** Bachelor of Computer Applications (BCA) — Final Year Project  
**Author / Candidate:** Final Year Student  
**Implementation Nature:** 100% Local Software Simulation (No real vehicle control, no real biometric hardware)

---

## 1. Abstract
The automotive industry is rapidly transitioning toward smart, connected, and keyless vehicle access ecosystems. Traditional physical key fobs are vulnerable to relay attacks, signal cloning, and theft. This project implements an **AI-Powered Smart Car Access and Keyless Assistance System**, engineered as a comprehensive local software simulation. The platform simulates multi-factor identity verification and dynamic behavioral risk analysis using local rule-based intelligence modeling. The application provides vehicle telematics management, biometric validation simulation, contextual risk assessment, automated threat alarms, and administrative fleet oversight with zero cloud or GPU requirements.

---

## 2. Introduction
Modern telematics platforms integrate software controls with vehicle access points. However, developing physical automotive hardware integrations poses safety hazards and high hardware costs for academic evaluation. This project addresses this challenge by providing a safe, faithful, and educational simulation of keyless vehicle access, demonstrating how AI-driven behavioral telemetry and identity verification can operate cohesively.

---

## 3. Problem Statement
Conventional automotive locking mechanisms exhibit significant vulnerabilities:
1. **Physical Key Vulnerabilities:** Susceptible to loss, duplication, and mechanical lock picking.
2. **Key Fob Signal Interception:** Radio frequency relay attacks allow unauthorized unlocking without owner awareness.
3. **Lack of Behavioral Context:** Traditional locks cannot distinguish whether an unlock attempt occurs during normal daytime hours or as an off-hours brute-force intrusion attempt.
4. **Hardware Danger in Education:** Connecting students directly to live CAN bus or vehicle actuators involves critical safety risks.

---

## 4. Objectives
- Develop a 100% local, safe software simulation of intelligent keyless automotive access.
- Implement an automated AI behavioral risk engine that calculates dynamic trust scores (0–100) across temporal and historical telemetry.
- Simulate biometric identity verification with realistic landmark detection and confidence scoring without collecting real biometric assets.
- Provide comprehensive vehicle fleet management for Indian vehicles (Hyundai Creta, Tata Nexon, Mahindra XUV700, Maruti Suzuki Swift).
- Implement role-based governance with administrative telematics analytics and immutable local file storage audit logging.

---

## 5. Existing System
Existing vehicle access systems primarily utilize mechanical keys or passive keyless entry (PKE) fobs operating via UHF/LF radio frequencies.
- **Drawbacks:**
  - Zero intelligence: The lock mechanism actuates unconditionally whenever a fob frequency is detected.
  - No threat awareness: No recording of repeated access failures or off-hours anomalous bursts.
  - Lack of centralized audit logs for driver reference.

---

## 6. Proposed System
The proposed system introduces an intelligent multi-stage software verification pipeline:
- **Stage 1 (Request):** Driver initiates access request from user console.
- **Stage 2 (Verify):** Simulated biometric pipeline validates optical illumination and match confidence.
- **Stage 3 (Analyze):** Local AI simulation evaluates temporal signals (e.g. 2:00 AM vs 2:00 PM), retry counters, and vehicle history.
- **Stage 4 (Decision):** Three-tier classification (Low Risk → Granted, Medium Risk → Review, High Risk → Blocked).
- **Stage 5 (Simulated Action):** Vehicle latch state updates in database without any real-world actuator risk.

---

## 7. Feasibility Study
- **Technical Feasibility:** Built entirely on open-source, standard technologies (React, TypeScript, Tailwind CSS, FastAPI, Python 3.13) requiring zero specialized hardware or GPUs.
- **Operational Feasibility:** 100% local operation with zero cloud bills or network downtime dependencies.
- **Economic Feasibility:** Zero subscription costs; runs on any standard student laptop.

---

## 8. Functional Requirements
- **FR1 User & Role Management:** User registration, password hashing (PBKDF2), JWT authorization, Admin and User roles.
- **FR2 Vehicle Fleet Telematics:** CRUD operations for Indian smart vehicles with registration validation.
- **FR3 Keyless Access Sequencing:** Multi-stage workflow from `LOCKED` to `UNLOCKED`.
- **FR4 Simulated Biometric Verification:** Image quality evaluation, match confidence computation, step-by-step progress logging.
- **FR5 AI Risk Classification:** Contextual feature evaluation, risk factor generation, and actionable recommendations.
- **FR6 Threat Monitoring:** Incident recording for high-risk access attempts.
- **FR7 Fleet Analytics:** Recharts visual time-series and risk distribution diagrams.

---

## 9. Non-Functional Requirements
- **Safety Guarantee:** Permanent display of simulation mode disclaimer; zero connection to physical automotive hardware.
- **Performance:** Sub-100ms API response time on local machine.
- **Security:** NIST-compliant PBKDF2 password derivation (100,000 iterations); HS256 JWT tokens.
- **Usability:** Premium cyber dark automotive user interface with Framer Motion transitions.

---

## 10. System Architecture
The application employs a 3-tier decoupled architecture:
1. **Client Tier:** React 18, Vite, TypeScript, Tailwind CSS, Recharts.
2. **Application Tier:** FastAPI (Python 3.13), Pydantic v2 schemas, REST endpoints.
3. **Intelligence & Storage Tier:** Local rule-based AI risk engine coupled with local file-persisted JSON collections.

---

## 11. Module Description
1. **Authentication Module:** Manages token issuance, session checks, and password verification.
2. **Vehicle Telematics Module:** Controls vehicle registry, specifications, and simulated latch states.
3. **Smart Access Workflow Module:** Coordinates the 5-step keyless access protocol.
4. **AI Risk Assessment Engine:** Computes risk indices using mathematical heuristics and situational signals.
5. **Security & Threat Intelligence Module:** Flags high-risk anomalies and maintains active alert feeds.
6. **Admin Telematics Portal:** Aggregates multi-user statistics and provides fleet-wide oversight.

---

## 12. AI Simulation Methodology
The artificial intelligence subsystem is explicitly designed as an academic simulation engine. Rather than relying on heavyweight deep neural networks that demand GPU compute, the module uses a deterministic weighted multi-criteria decision algorithm modeling realistic risk parameters.

---

## 13. Algorithm
```
ALGORITHM: SmartCarAccessVerificationPipeline
INPUT: vehicleId, scenarioMode, driverContext
OUTPUT: accessDecision, riskScore, updatedState

1. Retrieve vehicle from local database.
2. IF vehicle status is not 'locked', RETURN error.
3. UPDATE vehicle status to 'access_requested'.
4. EXECUTE simulated biometric verification:
   - Generate match confidence (conf).
   - Evaluate optical frame quality.
5. COLLECT contextual security features:
   - failed_attempts: integer
   - access_hour: integer (0 - 23)
   - recent_requests: integer
   - suspicious_history: boolean
6. COMPUTE risk score:
   Score = 20 (base risk)
   IF conf < 60 THEN Score += 30
   ELSE IF conf < 80 THEN Score += 15
   ELSE IF conf >= 90 THEN Score -= 10
   IF failed_attempts >= 3 THEN Score += 25
   IF access_hour >= 23 OR access_hour <= 5 THEN Score += 15
   IF recent_requests >= 5 THEN Score += 20
   IF suspicious_history THEN Score += 20
   Score = CLAMP(Score, 0, 100)
7. EVALUATE decision:
   IF Score <= 30 THEN:
      Policy = 'Simulated Access Granted'
      Allow simulated unlock
   ELSE IF Score <= 70 THEN:
      Policy = 'Additional Verification Required'
   ELSE:
      Policy = 'Simulated Access Denied'
      CREATE security incident in security_events.json
8. LOG transaction in access_logs.json.
9. RETURN decision and risk telemetry to client.
```

---

## 14. Database Design
The persistent tier uses atomic JSON file collections:
- `users.json`: Identity documents with salted password hashes.
- `vehicles.json`: Vehicle profiles, registration numbers, colors, and latch statuses.
- `access_logs.json`: Historical records of every simulated unlock attempt.
- `security_events.json`: Intrusion alarms and high-risk anomalies.
- `notifications.json`: User and admin notifications.

---

## 15. ER Diagram Description
Users maintain a 1-to-many relationship with Vehicles, Access Logs, and Notifications. Vehicles maintain a 1-to-many relationship with Access Logs and Security Events.

---

## 16. Use Case Diagram Description
Drivers interact with Vehicle Enrollment, Keyless Access Sequencing, Biometric Simulation, and Log Viewing. Administrators interact with Account Governance, Fleet Oversight, and Threat Analytics.

---

## 17. DFD Level 0
Captures single-process interaction between Drivers/Admins and the Smart Car Access System over authenticated HTTP JSON channels.

---

## 18. DFD Level 1
Deconstructs the system into sub-processes: Authentication, Vehicle Telematics, Access Sequencing, Biometric Simulation, Risk Scoring, and Threat Logging.

---

## 19. Flowchart
Visualizes branching logic: Request → Verify → Decision Matrix (Low/Med/High) → Unlock or Alarm.

---

## 20. UI Description
- **Landing Page:** Public showcase with SVG vehicle visual, 5-stage workflow steps, features, and future roadmap.
- **User Dashboard:** 5 top KPI cards, circular SVG AI Security Score widget, vehicle card, and recent activity.
- **Smart Access Console:** Step-by-step animated control panel with live camera viewfinder scanning simulation.
- **AI Insights:** Interactive risk simulator sandbox allowing real-time parameter tuning and Recharts charts.
- **Admin Dashboard:** Fleet statistics, AreaChart daily trend, PieChart risk tiers, BarChart vehicle utilization.

---

## 21. Testing
- **Unit & Integration Tests:** 8 backend test suites using `pytest` verifying auth, CRUD, risk scoring, access workflows, and admin safeguards.
- **Frontend Build Verification:** Full TypeScript compilation and production bundling via Vite (`tsc -b && vite build`) passing with zero errors.

---

## 22. Results
The application successfully demonstrates all smart car access capabilities in local simulation mode. State transitions are instantaneous, animations are fluid, and risk calculations strictly adhere to academic behavioral parameters.

---

## 23. Advantages
- Completely safe: zero risk of vehicle damage or accidental actuation.
- Zero cost: runs on local storage without cloud database bills.
- Educational transparency: examiner can tweak risk parameters live and observe scoring mechanics.

---

## 24. Limitations
- Does not actuate physical automotive hardware.
- Identity verification is simulated and not connected to live government biometric databases.

---

## 25. Future Enhancement
- Hardware bridging via CAN bus shields for post-academic automotive prototypes.
- NFC/BLE smartphone digital key pairing.
- Cloud telematics replication with multi-tenant encryption.

---

## 26. Conclusion
The AI-Powered Smart Car Access and Keyless Assistance System fulfills all criteria for a final-year BCA project, offering a high-polish, academically rigorous software simulation of modern automotive cybersecurity telematics.

---

## 27. References
1. FastAPI Official Documentation — https://fastapi.tiangolo.com
2. React 18 & TypeScript Handbook — https://react.dev
3. Tailwind CSS Component Framework — https://tailwindcss.com
4. Framer Motion Animation Architecture — https://www.framer.com/motion
5. Recharts Data Visualization Library — https://recharts.org
6. NIST Special Publication 800-63B: Digital Identity Guidelines
