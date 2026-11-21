# 🎯 JobHunter AI — AI-Powered Resume-Based Job Hunter Portal

JobHunter AI is a production-quality, stateless web portal designed to help job seekers discover real-time matching employment opportunities by analyzing their resumes using LLM-powered intelligence. 

The application evaluates uploaded resumes against live job descriptions from verified job board APIs, calculates an explainable weighted compatibility score, detects missing vs. matching skills, and provides direct application links alongside verified company recruiter search shortcuts.

---

## ⚡ Key Highlights & Architecture

- **Stateless & Database-Free**: No database (No MongoDB, PostgreSQL, SQLite, Firebase, etc.). Uploaded resumes are parsed in-memory, converted to structured data, and deleted immediately after processing.
- **Privacy First**: Zero permanent persistence on the server. Your candidate profile and saved pipeline stay strictly inside your browser's `localStorage`.
- **Intelligent LLM Parsing**: Uses **Groq API** (`llama-3.3-70b-versatile`) with structured JSON schema extraction, with an intelligent deterministic rule-based fallback if an API key is not configured.
- **Weighted Compatibility Engine**:
  - Technical Skills Match: **40%**
  - Experience Level & Years: **25%**
  - Role & Responsibilities Alignment: **20%**
  - Education & Background: **15%**
- **Live Job Aggregation**: Connects to **Arbeitnow**, **Remotive**, and **Adzuna** APIs with automated deduplication and URL validation.
- **Recruiter & Contact Discovery**: Provides direct links to talent acquisition contacts and verified LinkedIn recruiter search queries without fabricating emails or numbers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **Notifications**: Sonner
- **API Client**: Axios

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **Server**: Uvicorn
- **Data Validation**: Pydantic v2
- **Document Extractors**: `pypdf`, `python-docx`
- **External Integrations**: `httpx`, `groq`

---

## 🔑 Environment Variables Setup

### 1. Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:

```env
# Groq API for LLM resume extraction & semantic match explanations (Free key at https://console.groq.com/keys)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Adzuna API (Optional for extra US/UK listings; Arbeitnow & Remotive work without any keys)
ADZUNA_APP_ID=
ADZUNA_APP_KEY=

# Allowed frontend origin for CORS
FRONTEND_URL=http://localhost:5173
PORT=8000
HOST=0.0.0.0
```

### 2. Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python run.py
```
The backend will start at: `http://localhost:8000`  
Interactive Swagger docs: `http://localhost:8000/docs`  
Health check: `http://localhost:8000/api/health`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will start at: `http://localhost:5173`

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and providers readiness check |
| `POST` | `/api/resume/analyze` | Upload PDF or DOCX resume to extract structured candidate profile |
| `POST` | `/api/jobs/search` | Search and discover jobs based on resume skills and roles |
| `POST` | `/api/jobs/match` | Perform detailed weighted matching and semantic breakdown on a specific job |
| `POST` | `/api/contacts/search` | Discover verified recruiter contacts and LinkedIn talent acquisition links |

---

## 🔒 Security & Privacy

1. **No Data Storage**: The backend maintains no database connection or storage buckets. Resumes are processed in volatile memory and discarded.
2. **Safe Secrets**: All API keys remain isolated in `backend/.env` (excluded by `.gitignore`).
3. **CORS Restrictions**: Only requests originating from the configured frontend URL are accepted.
4. **No Fabricated Data**: The contact discovery engine never guesses recruiter emails or phone numbers. If a direct verified contact is not found, an official targeted LinkedIn search query is provided.
