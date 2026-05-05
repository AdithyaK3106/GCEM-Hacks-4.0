# Project Directory Structure

This document provides a comprehensive overview of the project's file hierarchy.

## 📂 Root Directory
- **Backend/**: All server-side logic and assets.
- **Frontend/**: Client-side application code.
- **Full_Project_Structure.docx**: Detailed Word document of the structure.
- **Project_Structure.docx**: Initial Word document of the structure.
- **README.md**: Project overview and setup guide.

---

## 🛠️ Backend Structure
```text
Backend/
├── app/
│   ├── db/
│   │   └── database.py          # SQLite configuration
│   ├── models/
│   │   └── sqlalchemy_models.py # DB Table definitions
│   ├── routes/                  # API Route definitions
│   ├── schemas/
│   │   └── pydantic_schemas.py  # Data validation & FE Contracts
│   ├── services/
│   │   └── logic.py             # Deterministic intelligence logic
│   └── utils/
│       └── uuid_helper.py       # Session ID generator
├── data/                        # Persistent storage
├── demo_assets/                 # JSON Mock Data
│   ├── intelligence.json
│   ├── notes.json
│   ├── quiz.json
│   ├── responses.json
│   └── transcript.json
├── .env                         # Environment variables (DEMO_MODE)
├── main.py                      # FastAPI entry point
├── requirements.txt             # Python dependencies
└── zero_friction_api_contract.md # Frontend integration guide
```

## 💻 Frontend Structure (React + Vite)
```text
Frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images and icons
│   ├── components/
│   │   ├── layout/          # Navbar, Footer, Wrapper
│   │   └── ui/              # Buttons, Cards, Inputs
│   ├── context/             # Global state (Session management)
│   ├── pages/               # Main Views (Upload, Quiz, Results)
│   ├── services/            # API client (Axios/Fetch)
│   ├── App.jsx              # Main router & layout
│   ├── App.css              # App-specific styles
│   ├── index.css            # Global Tailwind/CSS tokens
│   └── main.jsx             # Entry point
├── package.json             # Frontend dependencies
├── vite.config.js           # Vite configuration
└── zero_friction_api_contract.md # Frontend local copy of the contract
```

---

## 📄 File Details (Backend)
| File | Purpose |
| :--- | :--- |
| `main.py` | Orchestrates endpoints and wraps responses in global status objects. |
| `logic.py` | Forces the deterministic Mastery/Misconception flow for the demo. |
| `pydantic_schemas.py` | Defines the Zero-Friction UI contract (colors, labels, etc.). |
| `demo_assets/*.json` | Source of truth for all demo data (Transcript, Notes, Quiz). |

## 📄 File Details (Frontend)
| File | Purpose |
| :--- | :--- |
| `App.jsx` | Handles the primary routing for the learning loop (Upload -> Notes -> Quiz). |
| `services/` | Contains the logic for calling the `/submit` and `/upload` endpoints. |
| `context/` | Manages the `session_id` and global learner state across pages. |
| `index.css` | Implements the design tokens (Colors, Typography) defined in the contract. |

---
*Generated automatically for the Gopalan Hackathon.*
