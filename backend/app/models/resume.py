from typing import List, Optional
from pydantic import BaseModel, Field

class PersonalInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

class SkillsProfile(BaseModel):
    programming_languages: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)

class ExperienceSummary(BaseModel):
    total_years: float = 0.0
    level: str = "Fresher"

class EducationItem(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[str] = None

class ProjectItem(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)

class ResumeProfile(BaseModel):
    personal_info: PersonalInfo = Field(default_factory=PersonalInfo)
    skills: SkillsProfile = Field(default_factory=SkillsProfile)
    experience: ExperienceSummary = Field(default_factory=ExperienceSummary)
    education: List[EducationItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    suggested_roles: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
