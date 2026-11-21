import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    print("Health Check:", data)
    assert data["status"] == "online"
    assert "none" in data["database"].lower()

def test_contacts_search():
    res = client.post("/api/contacts/search", json={"company": "Google", "title": "Software Engineer"})
    assert res.status_code == 200
    data = res.json()
    print("Contacts Search:", data)
    assert "linkedin_url" in data
    assert "Google" in data["linkedin_url"]

def test_jobs_search():
    payload = {
        "profile": {
            "personal_info": {"name": "Alex Candidate", "email": "alex@example.com"},
            "skills": {
                "programming_languages": ["Python", "JavaScript"],
                "frameworks": ["React", "FastAPI"],
                "databases": ["PostgreSQL"],
                "tools": ["Docker", "Git"]
            },
            "experience": {"total_years": 3.0, "level": "Mid-level"},
            "education": [],
            "projects": [],
            "suggested_roles": ["Full Stack Developer", "Python Developer"]
        },
        "filters": {"query": "python"}
    }
    res = client.post("/api/jobs/search", json=payload)
    assert res.status_code == 200
    data = res.json()
    print(f"Jobs Discovered: {len(data['jobs'])} listings")
    assert len(data["jobs"]) > 0
    first_job = data["jobs"][0]
    assert "title" in first_job
    assert "company" in first_job
    assert first_job.get("match_score") is not None
    print(f"Top Job: {first_job['title']} at {first_job['company']} (Match: {first_job['match_score']}%)")

def test_job_match():
    payload = {
        "profile": {
            "personal_info": {"name": "Alex Candidate"},
            "skills": {
                "programming_languages": ["Python"],
                "frameworks": ["FastAPI"],
                "databases": ["PostgreSQL"],
                "tools": ["Git"]
            },
            "experience": {"total_years": 2.0, "level": "Junior"},
            "suggested_roles": ["Python Developer"]
        },
        "job": {
            "job_id": "test-123",
            "title": "Backend Python Developer",
            "company": "FastAPI Labs",
            "description": "Looking for a Python developer with FastAPI and SQL skills. Experience with AWS is a plus.",
            "required_skills": ["Python", "FastAPI", "SQL", "AWS"],
            "job_url": "https://example.com/apply"
        }
    }
    res = client.post("/api/jobs/match", json=payload)
    assert res.status_code == 200
    data = res.json()
    print("Match Analysis:", data)
    assert data["match_score"] > 50
    assert "Python" in data["matching_skills"]
    assert len(data["explanation"]) > 10

if __name__ == "__main__":
    print("--- RUNNING INTEGRATION TESTS ---")
    test_health()
    test_contacts_search()
    test_jobs_search()
    test_job_match()
    print("--- ALL TESTS PASSED SUCCESSFULLY! ---")
