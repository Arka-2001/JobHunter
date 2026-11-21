import httpx
import logging
from typing import List, Optional
from app.config import settings
from app.models.job import JobListing

logger = logging.getLogger("jooble_service")

class JoobleService:
    @staticmethod
    async def fetch_jobs(query: Optional[str] = None, location: Optional[str] = None) -> List[JobListing]:
        if not settings.JOOBLE_API_KEY or not settings.JOOBLE_API_KEY.strip():
            return []

        api_url = f"https://jooble.org/api/{settings.JOOBLE_API_KEY.strip()}"
        payload = {
            "keywords": query or "software developer",
            "location": location or ""
        }

        jobs = []
        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                res = await client.post(api_url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    raw_jobs = data.get("jobs", [])
                    for item in raw_jobs:
                        job_id = f"jooble-{item.get('id', '')}"
                        job = JobListing(
                            job_id=job_id,
                            title=item.get("title", "Untitled Position"),
                            company=item.get("company", "Unknown Company"),
                            location=item.get("location") or "Remote / Flexible",
                            work_mode="Remote" if "remote" in (item.get("title", "") + item.get("location", "")).lower() else "On-site",
                            employment_type=item.get("type") or "Full-time",
                            description=item.get("snippet", ""),
                            required_skills=[],
                            salary=item.get("salary") or None,
                            job_url=item.get("link", ""),
                            source="Jooble",
                            posted_at=item.get("updated", None)
                        )
                        jobs.append(job)
                else:
                    logger.warning(f"Jooble API returned status {res.status_code}")
        except Exception as e:
            logger.warning(f"Failed to fetch jobs from Jooble: {e}")

        return jobs

jooble_service = JoobleService()
