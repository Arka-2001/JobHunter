from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.resume import ResumeProfile
from app.services.resume_parser import resume_parser_service
from app.services.resume_analyzer import resume_analyzer_service

router = APIRouter(prefix="/api/resume", tags=["Resume"])

@router.post("/analyze", response_model=ResumeProfile)
def analyze_resume(file: UploadFile = File(...)):
    """
    Stateless endpoint: Receives PDF/DOCX, extracts text in memory, 
    parses structured profile, and does not persist any files.
    """
    try:
        # Extract text from PDF or DOCX
        text = resume_parser_service.extract_text(file)
        
        # Analyze with Groq or fallback rule-based parser
        profile = resume_analyzer_service.analyze(text)
        return profile
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error analyzing resume: {str(e)}")
