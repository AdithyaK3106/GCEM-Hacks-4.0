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

Follow these steps to set up the environment for both the Backend and Frontend.

### 1. Prerequisites
Ensure you have the following installed:
- **Python 3.10+**
- **Node.js 18+**
- **NPM** (usually comes with Node.js)
- **Ollama** (for local LLM processing)
- **Tesseract OCR**: Required for PDF OCR.
  - *Windows*: Install via [vcpkg](https://github.com/UB-Mannheim/tesseract/wiki) and add to PATH.
- **Poppler**: Required for PDF to Image conversion.
  - *Windows*: Install via [Conda](https://anaconda.org/conda-forge/poppler) or download binaries and add `/bin` to PATH.

### 2. Backend Setup
1. **Navigate to the directory**:
   ```bash
   cd Backend
   ```
2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure Environment**:
   Create a `.env` file in the `Backend` directory:
   ```env
   APP_MODE=REAL
   DATABASE_URL=sqlite:///./data/local_db.sqlite
   OPENAI_API_KEY=your_key_here
   ```
4. **Prepare Local AI (Ollama)**:
   Ensure Ollama is running and pull the required model:
   ```bash
   ollama pull qwen2.5:7b
   ```
5. **Start the Server**:
   ```bash
   uvicorn main:app --reload
   ```

### 3. Frontend Setup
1. **Navigate to the directory**:
   ```bash
   cd Frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the Dev Server**:
   ```bash
   npm run dev
   ```

## 🎯 Demo Mode
The system features a "Hybrid Demo Mode" for flawless presentations:
- **Deterministic Loop**: The first submission results in **MASTERED**, while the second identifies a **MISCONCEPTION**.
- **Real Pipeline Fallback**: If the LLM or OCR fails, the system seamlessly transitions to curated mock data to ensure the UI never crashes.

## 🏗️ Architecture & Intelligence
- **ACT Model**: Evaluates learner state based on Accuracy, Confidence, and Time.
- **Lazy Loading**: Whisper models are loaded on-demand to save VRAM.
- **OCR Pipeline**: Dual-stage extraction using PyPDF with Tesseract fallback.

## 📜 API Contract
Detailed frontend-backend integration details can be found in `Backend/zero_friction_api_contract.md`.
