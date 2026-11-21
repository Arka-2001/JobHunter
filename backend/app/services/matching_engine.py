import re
import logging
from typing import List, Tuple, Dict, Any
from app.config import settings
from app.models.resume import ResumeProfile
from app.models.job import JobListing, JobMatchResponse

logger = logging.getLogger("matching_engine")

class MatchingEngine:
    def __init__(self):
        self.w_skills = settings.WEIGHT_SKILLS
        self.w_exp = settings.WEIGHT_EXPERIENCE
        self.w_resp = settings.WEIGHT_RESPONSIBILITIES
        self.w_edu = settings.WEIGHT_EDUCATION

    def evaluate_job(self, profile: ResumeProfile, job: JobListing) -> JobMatchResponse:
        # Collect candidate skills
        candidate_skills = set()
        for skill_list in [
            profile.skills.programming_languages,
            profile.skills.frameworks,
            profile.skills.databases,
            profile.skills.tools
        ]:
            for s in skill_list:
                candidate_skills.add(s.strip().lower())

        # Extract skills and keywords from Job Description
        jd_text = f"{job.title} {job.description}".lower()
        
        # Identified required skills
        job_skills = set()
        for s in job.required_skills:
            job_skills.add(s.strip().lower())

        # If job didn't have explicit required_skills tags, scan JD for common tech terms
        common_tech = [
            'python', 'javascript', 'typescript', 'react', 'node', 'fastapi', 
            'django', 'flask', 'sql', 'postgresql', 'mongodb', 'docker', 
            'kubernetes', 'aws', 'git', 'ci/cd', 'rest', 'api', 'graphql',
            'html', 'css', 'tailwind', 'vue', 'angular', 'c++', 'java', 'go'
        ]
        for tech in common_tech:
            if re.search(r'\b' + re.escape(tech) + r'\b', jd_text):
                job_skills.add(tech)

        # 1. Technical Skills Matching (40%)
        matching_skills = []
        missing_skills = []

        if job_skills:
            for js in job_skills:
                # Semantic / substring / synonym check
                is_match = False
                for cs in candidate_skills:
                    if js == cs or js in cs or cs in js or (js == 'react' and 'react.js' in cs) or (js == 'node' and 'node.js' in cs):
                        is_match = True
                        break
                if is_match:
                    matching_skills.append(js.title())
                else:
                    missing_skills.append(js.title())
            
            skill_score = (len(matching_skills) / max(len(job_skills), 1)) * 100
        else:
            # If no skills specified in JD, baseline default
            skill_score = 75.0
            matching_skills = [s.title() for s in list(candidate_skills)[:4]]

        # 2. Experience Compatibility (25%)
        exp_score = 70.0
        exp_compat = "Compatible"
        total_cand_exp = profile.experience.total_years
        
        jd_exp_match = re.search(r'(\d+)\+?\s*(?:years?|yrs?)', jd_text)
        if jd_exp_match:
            required_years = float(jd_exp_match.group(1))
            if total_cand_exp >= required_years:
                exp_score = 95.0
                exp_compat = f"Exceeds/Meets ({total_cand_exp} yrs vs {required_years} yrs required)"
            elif total_cand_exp >= required_years - 1:
                exp_score = 80.0
                exp_compat = f"Close Match ({total_cand_exp} yrs vs {required_years} yrs required)"
            else:
                exp_score = 55.0
                exp_compat = f"Below requirement ({total_cand_exp} yrs vs {required_years} yrs required)"
        else:
            exp_score = 80.0
            exp_compat = "Flexible experience requirements"

        # 3. Responsibilities Compatibility (20%)
        # Check title / role alignment with suggested roles
        resp_score = 65.0
        job_title_lower = job.title.lower()
        for role in profile.suggested_roles:
            role_words = [w for w in role.lower().split() if len(w) > 2]
            overlap = sum(1 for w in role_words if w in job_title_lower)
            if overlap >= 1:
                resp_score = max(resp_score, 90.0)
                break

        # 4. Education Compatibility (15%)
        edu_score = 85.0
        edu_compat = "Compatible"
        if "master" in jd_text or "phd" in jd_text:
            edu_score = 75.0
            edu_compat = "Advanced degree preferred"
        elif "bachelor" in jd_text or "degree" in jd_text:
            edu_score = 90.0
            edu_compat = "Degree requirements met"

        # Final Weighted Calculation
        final_score = (
            (skill_score * self.w_skills) +
            (exp_score * self.w_exp) +
            (resp_score * self.w_resp) +
            (edu_score * self.w_edu)
        )
        final_score = int(round(min(max(final_score, 45), 98)))

        # Category
        if final_score >= 80:
            category = "High Match"
        elif final_score >= 65:
            category = "Good Match"
        else:
            category = "Potential Match"

        # Explanation
        if matching_skills:
            explanation = (
                f"Candidate matches {len(matching_skills)} key technical competencies ({', '.join(matching_skills[:3])}). "
                f"Experience is {exp_compat.lower()}. "
            )
            if missing_skills:
                explanation += f"Familiarity with {', '.join(missing_skills[:2])} would strengthen qualification."
        else:
            explanation = "General technical foundation aligns with this posting's engineering scope."

        return JobMatchResponse(
            match_score=final_score,
            category=category,
            matching_skills=matching_skills[:6],
            missing_skills=missing_skills[:6],
            experience_compatibility=exp_compat,
            education_compatibility=edu_compat,
            explanation=explanation
        )

matching_engine = MatchingEngine()
