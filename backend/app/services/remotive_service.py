import httpx
import logging
from typing import List, Optional
from app.models.job import JobListing

logger = logging.getLogger("remotive_service")

class RemotiveService:
    BASE_URL = "https://remotive.com/api/remote-jobs"

    @staticmethod
    async def fetch_jobs(search_query: Optional[str] = None) -> List[JobListing]:
        jobs = []
        params = {"limit": "50"}
        if search_query:
            params["search"] = search_query

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(RemotiveService.BASE_URL, params=params)
                if res.status_code == 200:
                    data = res.json()
                    raw_items = data.get("jobs", [])
                    for item in raw_items:
                        job_id = f"remotive-{item.get('id', '')}"
                        job = JobListing(
                            job_id=job_id,
                            title=item.get("title", "Untitled Position"),
                            company=item.get("company_name", "Unknown Company"),
                            location=item.get("candidate_required_location") or "Remote Worldwide",
                            work_mode="Remote",
                            employment_type=item.get("job_type", "Full-time"),
                            description=item.get("description", ""),
                            required_skills=item.get("tags", []),
                            salary=item.get("salary") or None,
                            job_url=item.get("url", ""),
                            company_logo=item.get("company_logo", None),
                            source="Remotive",
                            posted_at=item.get("publication_date", None)
                        )
                        jobs.append(job)
                else:
                    logger.warning(f"Remotive returned status: {res.status_code}")
        except Exception as e:
            logger.warning(f"Failed to fetch from Remotive: {e}")
        return jobs

remotive_service = RemotiveService()
