# AI Simulation Engine — Academic Specification

## Academic Nature and Non-Hardware Disclaimer
> 🔒 **Simulation Mode — No real vehicle control**  
> "A simulated AI-based identity verification and risk assessment module developed for academic demonstration."

This module is designed strictly as a local software simulation for a **BCA Final Year Project**. 
- It does **NOT** connect to any real automotive hardware, door latches, CAN bus, OBD, immobilizers, or Bluetooth/NFC actuators.
- It does **NOT** connect to cloud AI APIs (such as OpenAI, Gemini, Claude, or AWS Rekognition).
- It runs 100% locally with zero external network dependencies and no GPU requirements.

---

## Architecture & Algorithmic Design

### 1. Risk Evaluation Model
The AI engine assesses multiple contextual security parameters:
- `Verification Confidence` ($\Delta \text{conf}$)
- `Historical Failed Attempts` ($\text{failures}$)
- `Access Window` ($\text{hour}$)
- `Frequency Burst Rate` ($\text{freq}$)
- `Historical Security Alerts Flag` ($\text{flag}_{\text{alert}}$)
- `Unknown Terminal / Device Signature` ($\text{flag}_{\text{device}}$)

### 2. Scoring Formula
$$\text{Base Risk} = 20$$
$$\text{Risk Score} = \text{Clamp}_{0}^{100}\Big(\text{Base Risk} + \sum \Delta_{\text{factors}}\Big)$$

### 3. Classification Tiers
- **LOW (0 – 30)**: High confidence, normal operating conditions. Simulated Access Granted.
- **MEDIUM (31 – 70)**: Ambiguous signals. Additional Verification Required.
- **HIGH (71 – 100)**: Critical anomaly detected. Simulated Access Denied and Security Event recorded in local database.
