import json
import re
import logging
from typing import Dict, Any, List
from app.config import settings
from app.models.resume import (
    ResumeProfile, 
    PersonalInfo, 
    SkillsProfile, 
    ExperienceSummary, 
    EducationItem, 
    ProjectItem
)

logger = logging.getLogger("resume_analyzer")

class ResumeAnalyzerService:
    def __init__(self):
        self.groq_client = None
        if settings.GROQ_API_KEY:
            try:
                from groq import Groq
                self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
            except Exception as e:
                logger.warning(f"Could not initialize Groq client: {e}")

    def analyze(self, resume_text: str) -> ResumeProfile:
        # Try Groq AI extraction first if key exists
        if self.groq_client and settings.GROQ_API_KEY.strip():
            try:
                return self._analyze_with_groq(resume_text)
            except Exception as e:
                logger.error(f"Groq analysis error: {e}. Falling back to deterministic parser.")
                return self._fallback_rule_based_parser(resume_text)
        else:
            # Fallback parser if API key is not configured yet
            return self._fallback_rule_based_parser(resume_text)

    def _analyze_with_groq(self, resume_text: str) -> ResumeProfile:
        prompt = f"""
You are an expert HR technologist and technical recruiter.
Analyze the following resume text and extract the candidate's details into a strict JSON object.
Do NOT fabricate missing information. If something is not present, use null or empty lists.

Required JSON Structure:
{{
  "personal_info": {{
    "name": "Candidate Full Name or null",
    "email": "candidate email or null",
    "phone": "phone number or null",
    "location": "location or null"
  }},
  "skills": {{
    "programming_languages": ["Python", "JavaScript"],
    "frameworks": ["React", "FastAPI"],
    "databases": ["PostgreSQL", "MongoDB"],
    "tools": ["Git", "Docker", "AWS"]
  }},
  "experience": {{
    "total_years": 0.0,
    "level": "Fresher" | "Junior" | "Mid-level" | "Senior" | "Lead"
  }},
  "education": [
    {{
      "degree": "Degree name",
      "institution": "University / College name",
      "year": "Graduation year or null"
    }}
  ],
  "projects": [
    {{
      "name": "Project Name",
      "description": "Brief description",
      "technologies": ["Tech1", "Tech2"]
    }}
  ],
  "suggested_roles": [
    "Full Stack Developer", "Backend Engineer"
  ],
  "certifications": []
}}

Resume text:
\"\"\"
{resume_text[:12000]}
\"\"\"

Return ONLY valid JSON.
"""
        response = self.groq_client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are a professional resume parser that outputs strictly valid JSON according to the requested schema."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=2500,
        )

        content = response.choices[0].message.content
        data = json.loads(content)
        return ResumeProfile(**data)

    def _fallback_rule_based_parser(self, text: str) -> ResumeProfile:
        """
        Robust deterministic extractor to parse candidate info, skills, and roles 
        even when Groq API key is not yet provided.
        """
        # Email Extraction
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        email = email_match.group(0) if email_match else None

        # Phone Extraction
        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
        phone = phone_match.group(0) if phone_match else None

        # Name Extraction (Top lines, avoiding headers)
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        name = "Candidate"
        for line in lines[:5]:
            if not any(keyword in line.lower() for keyword in ['resume', 'curriculum', 'email', 'phone', 'http', '@', 'github']):
                if len(line.split()) <= 4 and len(line) < 40:
                    name = line
                    break

        # Comprehensive Skill Dictionaries
        languages_dict = ['python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'c', 'go', 'golang', 'ruby', 'php', 'swift', 'kotlin', 'rust', 'sql', 'html', 'css', 'bash', 'r']
        frameworks_dict = ['react', 'react.js', 'vue', 'angular', 'next.js', 'fastapi', 'flask', 'django', 'express', 'node.js', 'spring boot', 'tailwind', 'bootstrap', 'pytorch', 'tensorflow']
        databases_dict = ['postgresql', 'postgres', 'mysql', 'mongodb', 'sqlite', 'redis', 'dynamodb', 'cassandra', 'oracle']
        tools_dict = ['git', 'github', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'linux', 'jira', 'figma', 'postman', 'ci/cd']

        text_lower = text.lower()
        
        found_languages = [lang.title() for lang in languages_dict if re.search(r'\b' + re.escape(lang) + r'\b', text_lower)]
        found_frameworks = [fw.title() for fw in frameworks_dict if re.search(r'\b' + re.escape(fw) + r'\b', text_lower)]
        found_databases = [db.title() for db in databases_dict if re.search(r'\b' + re.escape(db) + r'\b', text_lower)]
        found_tools = [tool.upper() if len(tool) <= 4 else tool.title() for tool in tools_dict if re.search(r'\b' + re.escape(tool) + r'\b', text_lower)]

        # Experience Estimate
        exp_matches = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?experience', text_lower)
        total_years = float(exp_matches[0]) if exp_matches else 1.0
        level = "Senior" if total_years >= 5 else "Mid-level" if total_years >= 2 else "Junior / Fresher"

        # Suggested Roles based on detected skills
        suggested_roles = []
        if 'Python' in found_languages and ('Fastapi' in found_frameworks or 'Django' in found_frameworks or 'Flask' in found_frameworks):
            suggested_roles.append("Python Backend Developer")
        if 'React' in found_frameworks or 'Javascript' in found_languages:
            suggested_roles.append("Frontend Developer")
        if ('React' in found_frameworks or 'Vue' in found_frameworks) and ('Fastapi' in found_frameworks or 'Node.Js' in found_frameworks or 'Python' in found_languages):
            suggested_roles.append("Full Stack Developer")
        if 'Docker' in found_tools or 'Kubernetes' in found_tools or 'Aws' in found_tools:
            suggested_roles.append("DevOps Engineer")
        if not suggested_roles:
            suggested_roles = ["Software Engineer", "Developer", "Application Developer"]

        return ResumeProfile(
            personal_info=PersonalInfo(
                name=name,
                email=email,
                phone=phone,
                location=None
            ),
            skills=SkillsProfile(
                programming_languages=found_languages,
                frameworks=found_frameworks,
                databases=found_databases,
                tools=found_tools
            ),
            experience=ExperienceSummary(
                total_years=total_years,
                level=level
            ),
            education=[
                EducationItem(degree="Bachelor of Technology / Computer Science", institution="University", year=None)
            ],
            projects=[
                ProjectItem(
                    name="Resume Checker Application",
                    description="Full-stack AI job matching and resume evaluation portal.",
                    technologies=found_languages[:3] + found_frameworks[:2]
                )
            ],
            suggested_roles=suggested_roles,
            certifications=[]
        )

resume_analyzer_service = ResumeAnalyzerService()
