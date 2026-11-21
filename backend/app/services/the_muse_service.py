import httpx
import logging
from typing import List, Optional
from app.config import settings
from app.models.job import JobListing

logger = logging.getLogger("the_muse_service")

class TheMuseService:
    BASE_URL = "https://www.themuse.com/api/public/jobs"

    @staticmethod
    async def fetch_jobs(category: Optional[str] = "Software Engineering") -> List[JobListing]:
        params = {
            "page": 1,
            "category": category or "Software Engineering"
        }
        if settings.THE_MUSE_API_KEY and settings.THE_MUSE_API_KEY.strip():
            params["api_key"] = settings.THE_MUSE_API_KEY.strip()

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json"
        }

        jobs = []
        try:
            async with httpx.AsyncClient(timeout=12.0, headers=headers) as client:
                res = await client.get(TheMuseService.BASE_URL, params=params)
                if res.status_code == 200:
                    data = res.json()
                    results = data.get("results", [])
                    for item in results:
                        job_id = f"themuse-{item.get('id', '')}"
                        locations = item.get("locations", [])
                        loc_str = locations[0].get("name") if locations else "Remote / Flexible"
                        levels = item.get("levels", [])
                        level_str = levels[0].get("name") if levels else "Mid Level"

                        job = JobListing(
                            job_id=job_id,
                            title=item.get("name", "Untitled Position"),
                            company=item.get("company", {}).get("name", "Company"),
                            location=loc_str,
                            work_mode="Remote" if "remote" in loc_str.lower() or "flexible" in loc_str.lower() else "On-site",
                            employment_type="Full-time",
                            experience=level_str,
                            description=item.get("contents", ""),
                            required_skills=[],
                            job_url=item.get("refs", {}).get("landing_page", ""),
                            source="The Muse",
                            posted_at=item.get("publication_date", None)
                        )
                        jobs.append(job)
                else:
                    logger.warning(f"The Muse API returned status {res.status_code}")
        except Exception as e:
            logger.warning(f"Failed to fetch jobs from The Muse: {e}")

        return jobs

the_muse_service = TheMuseService()
