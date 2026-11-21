from typing import Optional
from pydantic import BaseModel

class ContactSearchRequest(BaseModel):
    company: str
    title: Optional[str] = "Recruiter"

class ContactInfo(BaseModel):
    company: str
    contact_name: Optional[str] = None
    designation: Optional[str] = "Talent Acquisition"
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    company_website: Optional[str] = None
    company_linkedin: Optional[str] = None
    source_url: Optional[str] = None
    verification_status: str = "Not verified"
