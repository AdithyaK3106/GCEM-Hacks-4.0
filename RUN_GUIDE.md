# 🚀 Quick Start Guide: Running the AI Learning System

Follow these steps to get the full-stack application running on your local machine in under 5 minutes.

## 📋 Prerequisites
Before you begin, ensure you have the following installed:
- **Python 3.10+**
- **Node.js 18+**
- **Ollama**: Running locally ([Download](https://ollama.com/))
- **Tesseract OCR**: Required for scanning images/PDFs.
- **Poppler**: Required for PDF rendering.

---

## 🛠️ Step 1: Backend Setup (FastAPI)

1. **Navigate to the Backend directory**:
   ```bash
   cd Backend
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Setup Local AI**:
   ```bash
   ollama pull qwen2.5:7b
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
2. **Upload**: Upload a PDF or start a Live Stream.
3. **Review**: Read the AI-generated topics and intuitions.
4. **Mastery Check**: 
   - **First Attempt**: Answer correctly to trigger **MASTERED**.
   - **Second Attempt**: Answer with high confidence but choose the wrong option to trigger the **MISCONCEPTION** detection.

---

## ❓ Troubleshooting

- **Ollama Error**: If the backend console shows connection errors, ensure Ollama is running (`ollama serve`).
- **OCR/PDF Error**: Ensure `tesseract` and `poppler/bin` are added to your system environment PATH.
- **VRAM Issues**: If using a GPU with < 8GB VRAM, the system may struggle with `qwen2.5:14b`. We recommend `qwen2.5:7b` for stability.

---
*Created for the Gopalan Hackathon 2026*
