# AI-Powered Personalized Learning System (MVP) - Project Context

This file contains team-shared architecture, conventions, and repo guidance for the project.

## Project Overview
This project is an intelligence-driven learning platform designed for hackathons. It uses the ACT (Accuracy, Confidence, Time) model to determine learner state, detects misconceptions, and provides adaptive recommendations. 

The system provides a "Zero-Friction API" that sends UI-ready responses with pre-defined colors, labels, and actions.

## 🛠️ Tech Stack & Conventions

### Backend
- **Location:** `/Backend`
- **Framework:** FastAPI (Python)
- **Database:** SQLite (SQLAlchemy)
- **Schema Validation:** Pydantic
- **Execution:** Run via `uvicorn main:app --reload`

### Frontend
- **Location:** `/Frontend/GCEM-Hacks-4.0-main/GCEM-Hacks-4.0-main` (Note the nested directory)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Execution:** Run via `npm run dev`

## 🚦 Workflows
- **Demo Mode:** The system is currently hard-wired for a perfect demo (1st submission is MASTERED, 2nd submission is MISCONCEPTION).
- **API Contract:** Refer to `artifacts/zero_friction_api_contract.md` (if available) for frontend integration details.
- When making backend changes, ensure the UI-ready zero-friction responses are maintained.
- When making frontend changes, adhere to the Tailwind styling conventions and ensure components can render the API's UI-ready responses accurately.
