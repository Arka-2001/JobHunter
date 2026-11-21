import httpx
import logging
from typing import List, Optional
from app.config import settings
from app.models.job import JobListing

logger = logging.getLogger("adzuna_service")

class AdzunaService:
    BASE_URL = "https://api.adzuna.com/v1/api/jobs/us/search/1"

    @staticmethod
    async def fetch_jobs(query: Optional[str] = "developer") -> List[JobListing]:
        if not settings.ADZUNA_APP_ID or not settings.ADZUNA_APP_KEY:
            # Silently skip if no credentials provided
            return []

        jobs = []
        params = {
            "app_id": settings.ADZUNA_APP_ID,
            "app_key": settings.ADZUNA_APP_KEY,
            "results_per_page": 25,
            "what": query or "software developer",
            "content-type": "application/json"
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(AdzunaService.BASE_URL, params=params)
                if res.status_code == 200:
                    data = res.json()
                    raw_items = data.get("results", [])
                    for item in raw_items:
                        job_id = f"adzuna-{item.get('id', '')}"
                        job = JobListing(
                            job_id=job_id,
                            title=item.get("title", "Untitled Position"),
                            company=item.get("company", {}).get("display_name", "Unknown Company"),
                            location=item.get("location", {}).get("display_name", "United States"),
                            work_mode="Remote" if "remote" in (item.get("title", "") + item.get("description", "")).lower() else "On-site",
                            employment_type=item.get("contract_type", "Full-time"),
                            description=item.get("description", ""),
                            required_skills=[],
                            job_url=item.get("redirect_url", ""),
                            source="Adzuna",
                            posted_at=item.get("created", None)
                        )
                        jobs.append(job)
                else:
                    logger.warning(f"Adzuna API returned {res.status_code}")
        except Exception as e:
            logger.warning(f"Failed to fetch from Adzuna: {e}")
        return jobs

adzuna_service = AdzunaService()
