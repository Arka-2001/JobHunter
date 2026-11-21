import httpx
import logging
from typing import List
from app.models.job import JobListing

logger = logging.getLogger("arbeitnow_service")

class ArbeitnowService:
    BASE_URL = "https://www.arbeitnow.com/api/job-board-api"

    @staticmethod
    async def fetch_jobs() -> List[JobListing]:
        jobs = []
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(ArbeitnowService.BASE_URL)
                if res.status_code == 200:
                    data = res.json()
                    raw_items = data.get("data", [])
                    for item in raw_items:
                        job_id = f"arbeitnow-{item.get('slug', item.get('title', ''))}"
                        job = JobListing(
                            job_id=job_id,
                            title=item.get("title", "Untitled Position"),
                            company=item.get("company_name", "Unknown Company"),
                            location=item.get("location") or ("Remote" if item.get("remote") else "On-site"),
                            work_mode="Remote" if item.get("remote") else "On-site",
                            employment_type="Full-time",
                            description=item.get("description", ""),
                            required_skills=item.get("tags", []),
                            job_url=item.get("url", ""),
                            source="Arbeitnow",
                            posted_at=None
                        )
                        jobs.append(job)
                else:
                    logger.warning(f"Arbeitnow returned status: {res.status_code}")
        except Exception as e:
            logger.warning(f"Failed to fetch from Arbeitnow: {e}")
        return jobs

arbeitnow_service = ArbeitnowService()
