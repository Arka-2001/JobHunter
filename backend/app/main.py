import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import resume, jobs, contacts

# Setup basic logging (no sensitive resume contents logged)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("job_hunter_api")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Stateless AI-Powered Job Hunter and Resume Matcher API"
)

# CORS configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(resume.router)
app.include_router(jobs.router)
app.include_router(contacts.router)

@app.get("/api/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify backend status, integrated providers, 
    and stateless architecture compliance.
    """
    sources = ["Arbeitnow (Public)", "Remotive (Public)", "The Muse (Public)"]
    if settings.JOOBLE_API_KEY:
        sources.append("Jooble (Configured)")
    else:
        sources.append("Jooble (Ready for API key)")
    if settings.ADZUNA_APP_ID:
        sources.append("Adzuna (Configured)")
    else:
        sources.append("Adzuna (Optional)")

    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "none (stateless architecture)",
        "ai_provider": "Groq API (configured)" if settings.GROQ_API_KEY else "Deterministic Rule-Based (Groq key optional)",
        "job_sources": sources
    }
