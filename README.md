# 🚀 SkillPilot AI — MoSPI AI-Enabled Capacity Building & Competency Platform

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue.svg)](https://sih.gov.in/)
[![Ministry of Statistics](https://img.shields.io/badge/MoSPI-Government%20of%20India-orange.svg)](https://mospi.gov.in/)
[![iGOT Karmayogi Bharat](https://img.shields.io/badge/iGOT-Karmayogi%20Bharat-green.svg)](https://igotkarmayogi.gov.in/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg)](https://vitejs.dev/)

> **Smart India Hackathon (SIH 2026)**
> **Problem Statement:** Develop an AI-enabled learning platform that identifies competency gaps, recommends personalized training through integration with the iGOT Karmayogi ecosystem, and generates Quizzes and MCQs from uploaded learning materials to strengthen capacity building in India's Official Statistical System.

---

## 🌟 Key Features

1. 🎯 **AI-Driven Competency Mapping & Gap Radar:**
   - Evaluates officers across 4 domains (Statistical, Technical, Digital Governance, Behavioural) against MoSPI cadre benchmarks (JSO, SSO, Director, ISS).
2. 📚 **Personalized iGOT Karmayogi Trajectories:**
   - Recommends accredited training modules with real-time gap matching and NSSTA 2026-27 TPAC calendar synchronization.
3. 🧠 **Document-to-MCQ AI Assessment Engine:**
   - Upload any official PDF/DOCX/manual to generate verified Multiple Choice Questions with explanations.
4. 🎙️ **Multilingual Voice Assistant (Bhashini-Ready):**
   - Bilingual voice-to-voice support (Hindi & English) for statistical queries, survey methods, and course navigation.
5. 📦 **SCORM 1.2 / xAPI 1-Click LMS Exporter:**
   - Packages custom AI quizzes into standard .zip files ready for direct import into iGOT Karmayogi.
6. 📊 **Admin Workforce Intelligence & Predictive Analytics:**
   - Org-wide skill heatmaps, completion rates, and national statistical readiness forecasting.

---

## 👥 Contributors & Core Team

- **Abhishek Kumar** ([@abhi63kum92](https://github.com/abhi63kum92)) — Lead Developer / Full-Stack & AI Architecture
- **Ichhaa Dahiya** ([@ichhaadahiya-AI](https://github.com/ichhaadahiya-AI)) — Research, Frontend & MoSPI Competency Evaluation
- **Suryanshi Sharma** ([@suryanshisharma-15](https://github.com/suryanshisharma-15)) — UI/UX Design, Data Modeling & iGOT Integration

---

## 🚀 Quick Start & Local Setup

### 1. Clone the Repository
`ash
git clone https://github.com/abhi63kum92/Skill-pilot-PROJECT.git
cd Skill-pilot-PROJECT
`

### 2. 1-Click Launch (Windows)
Double-click START_DEMO.bat or run:
`cmd
START_DEMO.bat
`

### 3. Manual Launch
**Backend:**
`ash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
`

**Frontend:**
`ash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
`

---

## 🏛️ Aligned Government Frameworks
- **iGOT Karmayogi Bharat Platform**
- **Mission Karmayogi & FRAC Framework (Capacity Building Commission)**
- **NSSTA TPAC Calendar 2026-27 (National Statistical Systems Training Academy)**
- **DPDP Act 2023 (Digital Personal Data Protection)**
- **SNA 2008 & National Indicator Framework (NIF) for SDGs**
