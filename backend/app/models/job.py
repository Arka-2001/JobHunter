from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.models.resume import ResumeProfile

class JobListing(BaseModel):
    job_id: str
    title: str
    company: str
    location: Optional[str] = "Remote"
    work_mode: Optional[str] = "Remote"
    employment_type: Optional[str] = "Full-time"
    description: str
    required_skills: List[str] = Field(default_factory=list)
    experience: Optional[str] = None
    salary: Optional[str] = None
    job_url: str
    company_logo: Optional[str] = None
    source: str = "External"
    posted_at: Optional[str] = None
    match_score: Optional[int] = None

class JobSearchRequest(BaseModel):
    profile: Optional[ResumeProfile] = None
    filters: Optional[Dict[str, Any]] = Field(default_factory=dict)

class JobMatchRequest(BaseModel):
    profile: ResumeProfile
    job: JobListing

class JobMatchResponse(BaseModel):
    match_score: int
    category: str
    matching_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    experience_compatibility: str = "Compatible"
    education_compatibility: str = "Compatible"
    explanation: str
