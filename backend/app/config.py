import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "AI-Powered Job Hunter API"
    VERSION: str = "1.0.0"
    
    # Environment & CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # AI - Groq configuration
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    
    # Job Providers
    ADZUNA_APP_ID: str = os.getenv("ADZUNA_APP_ID", "")
    ADZUNA_APP_KEY: str = os.getenv("ADZUNA_APP_KEY", "")
    JOOBLE_API_KEY: str = os.getenv("JOOBLE_API_KEY", "")
    THE_MUSE_API_KEY: str = os.getenv("THE_MUSE_API_KEY", "")
    
    # Scoring weights (must sum to 1.0)
    WEIGHT_SKILLS: float = 0.40
    WEIGHT_EXPERIENCE: float = 0.25
    WEIGHT_RESPONSIBILITIES: float = 0.20
    WEIGHT_EDUCATION: float = 0.15

settings = Settings()
