# AI-Powered Personalized Learning System (MVP)

A frictionless, intelligence-driven learning platform designed for hackathons. This system transforms raw educational content into a personalized learning loop that detects misconceptions in real-time.

## 🚀 Core Features
- **Deterministic Intelligence**: Uses the ACT (Accuracy, Confidence, Time) model to determine learner state.
- **Zero-Friction API**: UI-ready responses with pre-defined colors, labels, and actions.
- **Misconception Detection**: Specifically identifies when a user is wrong but highly confident, triggering a "Reality Check" correction.
- **Adaptive Recommendations**: Dynamically suggests next steps (Reteach, Practice, or Advance) based on proficiency.

## 🛠️ Tech Stack
### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (SQLAlchemy)
- **Schema**: Pydantic

### Frontend
- **Framework**: React 19 + Vite
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## 📂 Project Structure
```text
/Backend
  /app         # FastAPI core logic
  /data        # Persistent storage
  /demo_assets # Mock data for demo
  main.py      # Entry point
/Frontend
  /src         # React components & logic
  /public      # Static assets
  package.json # Dependencies
```

## 🚦 Getting Started

### 1. Backend Setup
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd Frontend/GCEM-Hacks-4.0-main/GCEM-Hacks-4.0-main
npm install
npm run dev
```

### 3. API Documentation
Once running, visit:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Redoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## 🎯 Demo Mode
The system is hard-wired for a perfect demo:
1. First Submission -> **MASTERED** (Green UI)
2. Second Submission -> **MISCONCEPTION** (Red UI + Detailed Explanation)

## 📜 API Contract
Refer to `artifacts/zero_friction_api_contract.md` for full frontend integration details.
