from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.models.job import JobSearchRequest, JobMatchRequest, JobMatchResponse, JobListing
from app.services.job_discovery import job_discovery_service
from app.services.matching_engine import matching_engine

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@router.post("/search")
async def search_jobs(payload: JobSearchRequest):
    """
    Discovers jobs from external APIs based on resume skills and roles,
    and calculates initial match scores if profile is supplied.
    """
    try:
        jobs = await job_discovery_service.discover_jobs(
            profile=payload.profile,
            filters=payload.filters
        )

        # If profile is present, compute match scores for the list
        if payload.profile:
            for job in jobs:
                eval_res = matching_engine.evaluate_job(payload.profile, job)
                job.match_score = eval_res.match_score

        return {"jobs": jobs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error discovering jobs: {str(e)}")

@router.post("/match", response_model=JobMatchResponse)
async def match_job(payload: JobMatchRequest):
    """
    Deep compatibility evaluation between a candidate's resume and a specific job.
    """
    try:
        result = matching_engine.evaluate_job(payload.profile, payload.job)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating match: {str(e)}")
