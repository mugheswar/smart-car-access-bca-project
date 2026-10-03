# Visual System Diagrams (Mermaid-Compatible)

## 1. System Architecture Diagram

```mermaid
flowchart TD
    User["Driver / Examiner"] -->|Interacts via Browser| Frontend["React 18 Frontend\n(Vite + TypeScript + Tailwind)"]
    Admin["System Administrator"] -->|Admin Portal| Frontend
    
    Frontend -->|REST API over HTTP/JSON\nBearer JWT| Backend["FastAPI Backend\n(Python 3.13 ASGI)"]
    
    subgraph Backend_Services["Backend Core Modules"]
        AuthSvc["Authentication Service\n(PBKDF2-HMAC-SHA256)"]
        VehSvc["Vehicle Fleet Service\n(CRUD Operations)"]
        AccSvc["Smart Access Pipeline\n(State Orchestrator)"]
        SecSvc["Threat Monitor & Alerts"]
        AISvc["AI Simulation Engine\n(Contextual Risk Evaluator)"]
    end
    
    Backend --> AuthSvc
    Backend --> VehSvc
    Backend --> AccSvc
    Backend --> SecSvc
    Backend --> AISvc
    
    subgraph Persistent_Storage["Local Storage Database"]
        DBUser["users.json"]
        DBVeh["vehicles.json"]
        DBLog["access_logs.json"]
        DBSec["security_events.json"]
        DBNotif["notifications.json"]
    end
    
    AuthSvc --> DBUser
    VehSvc --> DBVeh
    AccSvc --> DBVeh
    AccSvc --> DBLog
    SecSvc --> DBSec
    SecSvc --> DBNotif
    AISvc -.->|Scores Context| AccSvc
```

---

## 2. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ VEHICLES : owns
    USERS ||--o{ ACCESS_LOGS : initiates
    USERS ||--o{ NOTIFICATIONS : receives
    VEHICLES ||--o{ ACCESS_LOGS : targeted_in
    VEHICLES ||--o{ SECURITY_EVENTS : subject_of

    USERS {
        string id PK
        string name
        string email UK
        string phone
        string passwordHash
        string role
        string status
        datetime createdAt
    }

    VEHICLES {
        string id PK
        string ownerId FK
        string registrationNumber UK
        string brand
        string model
        string type
        int year
        string color
        string status
        int securityScore
        datetime lastAccess
        datetime createdAt
    }

    ACCESS_LOGS {
        string id PK
        string userId FK
        string vehicleId FK
        string verificationStatus
        float confidence
        int riskScore
        string riskLevel
        string accessStatus
        string policyAction
        string recommendation
        datetime timestamp
    }

    SECURITY_EVENTS {
        string id PK
        string userId FK
        string vehicleId FK
        string eventType
        string severity
        string description
        int riskScore
        string status
        datetime timestamp
    }

    NOTIFICATIONS {
        string id PK
        string userId FK
        string title
        string message
        string type
        boolean read
        datetime timestamp
    }
```

---

## 3. Use Case Diagram

```mermaid
flowchart LR
    subgraph Actors
        U((Registered Driver))
        A((System Admin))
    end

    subgraph System_Use_Cases["Smart Car Access System"]
        UC1[Register & Login]
        UC2[Enroll Smart Vehicle]
        UC3[Request Keyless Access]
        UC4[Simulated Biometric Verify]
        UC5[Execute AI Risk Analysis]
        UC6[Simulate Door Latch Unlock]
        UC7[View Personal Access History]
        UC8[View Security Alerts]
        UC9[Manage All User Accounts]
        UC10[Audit Fleet Telematics]
        UC11[Review Global Threat Logs]
    end

    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4
    U --> UC5
    U --> UC6
    U --> UC7
    U --> UC8

    A --> UC1
    A --> UC8
    A --> UC9
    A --> UC10
    A --> UC11
```

---

## 4. Data Flow Diagram — Level 0 (Context Level)

```mermaid
flowchart LR
    Driver[Driver / User] -->|Credentials & Unlock Request| System["AI-Powered Smart Car Access System\n(Local Simulation)"]
    System -->|State Updates, Risk Scores & Door Telematics| Driver
    
    Admin[Administrator] -->|User Governance & Audit Filters| System
    System -->|Fleet Analytics & Threat Reports| Admin
```

---

## 5. Data Flow Diagram — Level 1

```mermaid
flowchart TD
    User([User]) -->|Email & Password| P1["1.0 Authentication"]
    P1 -->|Query / Verify| D1[("users.json")]
    P1 -->|JWT Access Token| User

    User -->|Vehicle Specs| P2["2.0 Vehicle Management"]
    P2 -->|CRUD Operations| D2[("vehicles.json")]

    User -->|Initiate Unlock| P3["3.0 Smart Access Pipeline"]
    P3 -->|Update Status: access_requested| D2
    
    User -->|Submit Biometric Frame| P4["4.0 Simulated Verification"]
    P4 -->|Match Confidence| P5["5.0 AI Risk Engine"]
    
    P5 -->|Evaluate Temporal & History Features| D3[("security_events.json")]
    P5 -->|Risk Score & Policy| P3
    
    P3 -->|Record Session Result| D4[("access_logs.json")]
    P3 -->|High Risk Alert| D3
    P3 -->|Simulated Unlock Command| D2
    P3 -->|Visual Confirmation| User
```

---

## 6. Access Control Flowchart

```mermaid
flowchart TD
    Start([User Requests Keyless Access]) --> S1[Change Vehicle Status to ACCESS REQUESTED]
    S1 --> S2[Run Simulated Biometric Verification]
    S2 --> S3{Face Detected?}
    
    S3 -- No --> DenyFail[Verification FAILED\nAccess Denied]
    S3 -- Yes --> S4[Calculate Match Confidence %]
    
    S4 --> S5[Collect Security Context: Hour, Failures, Burst, History]
    S5 --> S6[AI Risk Engine Computes Score 0-100]
    
    S6 --> S7{Risk Tier?}
    
    S7 -- "0 - 30 (LOW)" --> S8[Simulated Access Granted]
    S8 --> S9[Unlock Vehicle Latches in Simulation]
    
    S7 -- "31 - 70 (MEDIUM)" --> S10[Additional Verification Prompted]
    
    S7 -- "71 - 100 (HIGH)" --> S11[Simulated Access Denied]
    S11 --> S12[Create Security Threat Event]
    S12 --> S13[Dispatch Admin Alert Notification]
    
    S9 --> S14[Append Entry to access_logs.json]
    S10 --> S14
    S13 --> S14
    S14 --> End([Dashboard Telematics Updated])
```
