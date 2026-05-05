# 🚀 Quick Start Guide: Running the AI Learning System

Follow these steps to get the full-stack application running on your local machine in under 5 minutes.

## 📋 Prerequisites
Before you begin, ensure you have the following installed:
- **Python 3.10+**
- **Node.js 18+**
- **NPM** (usually comes with Node.js)

---

## 🛠️ Step 1: Backend Setup (FastAPI)

1. **Navigate to the Backend directory**:
   ```bash
   cd Backend
   ```

2. **Create a Virtual Environment** (Recommended):
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows
   # or
   source venv/bin/activate      # Mac/Linux
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Server**:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will be live at `http://127.0.0.1:8000`*

---

## 💻 Step 2: Frontend Setup (React + Vite)

1. **Navigate to the Frontend directory**:
   ```bash
   cd Frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   *The frontend will be live at `http://localhost:5173`*

---

## 🎯 Step 3: Running the Demo

1. Open your browser and go to `http://localhost:5173`.
2. **Upload**: Click the upload area. In demo mode, any file will trigger the "Neural Networks" transcript.
3. **Review**: Read the AI-generated notes.
4. **Quiz**: Start the Mastery Check.
   - **Question 1**: Answer correctly (e.g., Option B). You will see the **MASTERED** (Green) state.
   - **Question 2**: Answer incorrectly but with high confidence. You will see the **MISCONCEPTION** (Red) state with the detailed reality-check explanation.
5. **Results**: View your final score and adaptive recommendations.

---

## ❓ Troubleshooting

- **Port Conflict**: If `5173` or `8000` is in use, the tools will automatically suggest another port. Ensure the Frontend's `.env` file points to the correct Backend URL.
- **Missing Dependencies**: Ensure you ran `pip install` and `npm install` inside their respective subdirectories.
- **Refresh Issue**: The app uses `localStorage` to persist your session, so you can safely refresh the browser during the demo.

---
*Created for the Gopalan Hackathon 2026*
