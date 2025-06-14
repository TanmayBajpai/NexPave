# NexPave: Crowdsourced Pothole Detection & Repair Platform

**NexPave** is an end-to-end, crowdsourced platform that streamlines the detection, verification, and repair of potholes using machine learning and a bounty-based incentive system. It increases transparency, efficiency, and accountability in road maintenance.

---

## 🚧 Problem Statement

Pothole identification and repair is traditionally inefficient, manually driven, and lacks both transparency and accountability. There’s often no reliable way to:
- Report potholes in a standardized format
- Track repair status
- Verify repair quality
- Incentivize timely contractor action

---

## ✅ Solution Overview

NexPave offers a decentralized, ML-driven system where users can report potholes, and verified contractors are rewarded for repairs via an automated bounty system.

### 🔁 Workflow

1. **Crowdsourced Reporting**  
   Users upload:
   - A pothole image  
   - Address  
   - GPS coordinates (latitude, longitude)  

2. **ML-Based Analysis**  
   - The image is processed by a YOLOv8 model (via FastAPI)  
   - Model outputs number and severity of potholes  

3. **Bounty Calculation**  
   Factors:
   - Pothole count and size  
   - Local traffic density  
   → Dynamic bounty is calculated and displayed  

4. **Repair Claim & Proof**  
   - Verified contractors claim bounties  
   - Upload an "after" image post-repair  

5. **Repair Verification**  
   - A second ML model compares "before" and "after" images  
   - Verifies if the pothole has been successfully repaired  

6. **Escrow Release**  
   - On successful verification, bounty is released to the contractor

---

## 🧱 System Architecture

| Component        | Tech Stack         |
|------------------|--------------------|
| **Frontend**     | React.js           |
| **Backend**      | Spring Boot        |
| **Database**     | H2                 |
| **ML Services**  | YOLOv8 via FastAPI |
| **Communication**| REST APIs          |

---

## 📂 Repository Structure

```
nexpave/
├── frontend/             # React.js frontend
├── backend/              # Spring Boot backend
├── FastAPI/              # YOLOv8 ML model via FastAPI
├── README.md
```



## 🚀 Getting Started

### Prerequisites
- Node.js + npm
- Java 17+
- Python 3.9+
- Ultralytics YOLOv8
