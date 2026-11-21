# Project: AI-Powered Resume-Based Job Hunter Portal

Act as a senior full-stack developer, AI engineer, software architect, and UI/UX designer.

I want you to build a complete, production-quality AI-powered Job Hunter Portal. The application's primary purpose is to allow users to upload their resumes and automatically discover relevant job opportunities based on their skills, experience, education, and projects.

The system should compare the uploaded resume with individual job descriptions, calculate a compatibility score, identify missing skills, provide direct application links, and discover publicly available company recruiter or HR contact information.

**IMPORTANT ARCHITECTURAL REQUIREMENTS:**

- The application must have a frontend and backend.
- Do NOT use any database.
- Do NOT introduce MongoDB, PostgreSQL, MySQL, SQLite, Firebase, Supabase, Redis, or any other database.
- Do NOT require user registration or login.
- Do NOT persist user information on the backend.
- Keep the backend stateless.
- Temporary uploaded files must be processed and deleted after processing.
- The frontend can use localStorage for saved jobs, preferences, and application tracking.
- The backend should handle secure API integrations, resume processing, job discovery, matching, and contact discovery.
- Keep all API secrets in backend environment variables.

Build the actual working application, not just a UI prototype.

---

# 1. TECHNOLOGY STACK

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React
- React Hot Toast or Sonner
- Recharts (for dashboard analytics, if needed)

## Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- Python-Multipart
- PyMuPDF or pdfplumber for PDF extraction
- python-docx for DOCX extraction
- httpx or requests for external API integrations
- python-dotenv

## AI and Matching

- Groq API for LLM-based resume analysis and structured extraction.
- A suitable available Groq model, configurable through environment variables.
- Sentence Transformers for semantic similarity, if appropriate.
- A rule-based weighted matching algorithm as the primary baseline.

## Deployment

- Frontend: Vercel
- Backend: Render
- No database service.

---

# 2. APPLICATION WORKFLOW

The application should follow this complete workflow:

1. User opens the Job Hunter Portal.
2. User uploads a PDF or DOCX resume.
3. Frontend sends the resume to the FastAPI backend.
4. Backend extracts text from the resume.
5. AI analyzes the resume and generates a structured profile.
6. Backend extracts skills, experience, education, projects, and preferred job roles.
7. The application discovers relevant job listings from supported external job APIs.
8. Backend retrieves job descriptions.
9. Matching engine compares the resume against every job description.
10. System calculates a match score for every job.
11. System identifies matching skills and missing skills.
12. System discovers publicly available company and recruiter information.
13. Frontend displays all matching jobs in a dashboard.
14. User can view the full job description, recruiter information, and application URL.
15. User can save jobs and track application status locally.

The resume should not be permanently stored.

---

# 3. FRONTEND REQUIREMENTS

Build a professional, modern SaaS dashboard.

Design inspiration:
- Clean and minimal interface.
- Modern SaaS dashboard.
- Professional typography.
- White/light background with dark navy sidebar.
- Violet or indigo accent colors.
- Rounded cards.
- Subtle shadows.
- Responsive design.
- Smooth transitions and hover effects.

The application must look like a real commercial product, not a basic student project.

## Pages

### A. Dashboard

Display:

- Total jobs discovered.
- Jobs with high match scores.
- Saved jobs.
- Jobs already applied to.
- Resume upload status.
- Recent matching jobs.
- Resume analysis summary.

### B. My Resume

Features:

- Upload PDF or DOCX.
- Drag-and-drop upload.
- File validation.
- Resume preview.
- Extracted personal information.
- Skills.
- Education.
- Experience.
- Projects.
- Technical tools.
- Resume analysis summary.

Provide an option to replace the uploaded resume.

### C. Find Jobs

Display job cards containing:

- Job title.
- Company name.
- Company logo, when available.
- Location.
- Work mode (Remote/Hybrid/On-site).
- Experience requirements.
- Salary, when available.
- Match percentage.
- Job posting date.
- Application link.
- Save-job button.

Add filters:

- Job title.
- Skills.
- Company.
- Location.
- Remote/Hybrid/On-site.
- Experience level.
- Minimum match score.
- Date posted.

Add sorting:

- Highest match.
- Latest jobs.
- Company name.

### D. Job Details

When a user clicks a job, display:

- Complete job description.
- Company information.
- Required skills.
- Matching skills.
- Missing skills.
- Experience requirements.
- Education requirements.
- Resume compatibility analysis.
- Match score breakdown.
- Direct application link.

### E. Company Contacts

For every job, provide a separate recruiter/contact section.

Display publicly available information where verifiable:

- Recruiter or HR person's name.
- Job designation.
- Company name.
- Official business email.
- Publicly listed business phone number.
- LinkedIn profile.
- Company website.
- LinkedIn company profile.

Every contact must have a source URL and verification status.

If contact details cannot be verified, clearly display "Not publicly available".

Never invent email addresses, phone numbers, or recruiter identities.

If individual contact information cannot be obtained, generate a LinkedIn search URL such as:

https://www.linkedin.com/search/results/people/?keywords=Talent%20Acquisition%20CompanyName

Also provide a company LinkedIn search link.

### F. Saved Jobs

Use localStorage to maintain:

- Saved jobs.
- Application status.
- Application date.
- Personal notes.
- Job application URL.

Application statuses:

- Interested.
- To Apply.
- Applied.
- Interview.
- Rejected.
- Offer Received.

No database should be used.

---

# 4. RESUME UPLOAD AND PARSING

Accept:

- PDF.
- DOCX.

Maximum file size: 10 MB.

Backend responsibilities:

1. Receive the uploaded file.
2. Validate file type and size.
3. Extract text.
4. Reject scanned PDFs if OCR is not configured, and explain the limitation.
5. Pass extracted text to the AI analysis service.
6. Return structured JSON.
7. Delete temporary files after processing, including when errors occur.

Extract the following information:

- Full name.
- Email.
- Phone number, if provided.
- Location, if provided.
- Technical skills.
- Programming languages.
- Frameworks.
- Databases.
- Tools.
- Work experience.
- Internship experience.
- Education.
- Projects.
- Certifications.
- Total experience, when determinable.
- Potential job roles.

Use Pydantic models to validate the structured AI output.

Example response:

{
  "personal_info": {
    "name": "Example Candidate",
    "email": "candidate@example.com",
    "phone": null,
    "location": "India"
  },
  "skills": {
    "programming_languages": ["Python", "JavaScript"],
    "frameworks": ["React", "FastAPI"],
    "databases": ["MongoDB"],
    "tools": ["Git", "Docker"]
  },
  "experience": {
    "total_years": 0,
    "level": "Fresher"
  },
  "education": [],
  "projects": [],
  "suggested_roles": [
    "Python Developer",
    "Full Stack Developer",
    "Software Engineer"
  ]
}

Do not fabricate missing resume information.

---

# 5. JOB DISCOVERY ENGINE

Build a modular job discovery service.

Investigate and integrate suitable job sources, prioritizing APIs that provide:

- Job title.
- Company name.
- Job description.
- Location.
- Employment type.
- Required skills.
- Experience requirements.
- Job posting date.
- Direct application URL.

Potential sources to investigate:

1. Arbeitnow Job Board API.
2. Remotive API.
3. Adzuna API.
4. Other legitimate job APIs with suitable access.

Do not assume an API is free, unrestricted, or compatible with browser/server access. Verify its current API documentation, authentication requirements, CORS rules, rate limits, geographical coverage, and usage terms before integrating.

Use separate provider modules:

- arbeitnow_service.py
- remotive_service.py
- adzuna_service.py

Normalize the output into one common Job model.

Example:

{
  "job_id": "unique-job-id",
  "title": "Python Developer",
  "company": "Example Company",
  "location": "Remote",
  "description": "Complete job description",
  "required_skills": ["Python", "FastAPI", "SQL"],
  "experience": "0-2 years",
  "job_url": "https://example.com/apply",
  "source": "Arbeitnow",
  "posted_at": null
}

Important requirements:

- Remove duplicate job listings.
- Validate job URLs.
- Handle unavailable APIs.
- Handle rate limits.
- Do not fabricate job listings.
- Clearly identify the original job source.
- Do not display expired or unavailable jobs as verified active openings.

If an API is unavailable, continue using other configured providers.

---

# 6. RESUME AND JOB DESCRIPTION MATCHING ENGINE

This is the core feature of the application.

Build a matching engine that evaluates every discovered job against the uploaded resume.

Use a weighted scoring system.

Suggested weights:

- Technical skills: 40%.
- Experience compatibility: 25%.
- Job responsibilities: 20%.
- Education and qualifications: 15%.

Total: 100%.

Calculate:

final_score =
(skill_score * 0.40) +
(experience_score * 0.25) +
(responsibility_score * 0.20) +
(education_score * 0.15)

These weights should be configurable.

The matching engine must:

1. Extract required skills from the JD.
2. Extract preferred skills.
3. Identify matching skills.
4. Identify missing skills.
5. Compare experience requirements.
6. Compare education requirements.
7. Compare job responsibilities.
8. Generate a compatibility score.
9. Generate a short explanation.

Use semantic matching where appropriate to recognize related skills and responsibilities.

For example:

Resume: "Developed RESTful services using FastAPI."

Job description: "Experience building REST APIs."

The system should recognize the semantic relationship.

Do not depend exclusively on exact keyword matching.

Return structured output:

{
  "match_score": 85,
  "category": "Good Match",
  "matching_skills": [
    "Python",
    "FastAPI",
    "REST APIs"
  ],
  "missing_skills": [
    "AWS",
    "Docker"
  ],
  "experience_compatibility": "Compatible",
  "education_compatibility": "Compatible",
  "explanation": "The candidate has strong backend development skills and relevant project experience."
}

The score must be an explainable estimate, not a guarantee of selection or hiring eligibility.

---

# 7. COMPANY AND RECRUITER CONTACT DISCOVERY

Create a separate contact discovery module.

Its purpose is to identify relevant publicly available hiring contacts for the company associated with each job.

Potential sources:

- Official company career pages.
- Official company contact pages.
- Public company directories.
- Legitimate people/contact enrichment APIs, where permitted.
- Publicly accessible professional profile information.

For each contact, return:

{
  "company": "Example Company",
  "contact_name": null,
  "designation": "Talent Acquisition",
  "email": null,
  "phone": null,
  "linkedin_url": "https://www.linkedin.com/search/results/people/?keywords=Example%20Company%20Recruiter",
  "company_website": null,
  "company_linkedin": null,
  "source_url": null,
  "verification_status": "Not verified"
}

Requirements:

- Never fabricate recruiter information.
- Never guess email addresses.
- Never invent phone numbers.
- Do not scrape LinkedIn or bypass its access restrictions.
- Respect privacy and data-source terms.
- Distinguish verified information from search suggestions.
- Do not present company switchboard numbers as personal recruiter numbers.
- Show "Contact not found" when appropriate.

Contact discovery must not prevent job listings from appearing when no contact is found.

---

# 8. BACKEND API DESIGN

Create these FastAPI endpoints:

POST /api/resume/analyze

Purpose:
Upload and analyze a resume.

Response:
Structured resume profile.

POST /api/jobs/search

Purpose:
Discover jobs based on resume skills and suggested roles.

Input:
Resume profile, filters, and search preferences.

Response:
Normalized job listings.

POST /api/jobs/match

Purpose:
Compare a resume profile against job descriptions.

Input:
Resume profile and job listing.

Response:
Match score, matching skills, missing skills, and explanation.

POST /api/contacts/search

Purpose:
Find publicly available company hiring contact information.

Input:
Company name and job title.

Response:
Verified contact information or LinkedIn search links.

GET /api/health

Purpose:
Check backend health.

Do not introduce database operations.

Use:
- Pydantic validation.
- Proper HTTP status codes.
- CORS configuration.
- Request validation.
- Error handling.
- Logging without sensitive resume contents.
- API timeouts.
- Rate-limit handling.

For larger batches of jobs, use asynchronous processing and limit concurrency to prevent API overload.

---

# 9. NO DATABASE ARCHITECTURE

This is a strict requirement.

Do not create database models, database connections, migrations, ORM configurations, or database containers.

The application should operate as follows:

Frontend:
- Maintains the current resume profile in React state.
- Maintains current search results in React state.
- Stores saved jobs in localStorage.
- Stores application status in localStorage.
- Stores user preferences in localStorage.

Backend:
- Receives uploaded files temporarily.
- Extracts resume information.
- Calls configured external APIs.
- Calculates matching scores.
- Returns results.
- Deletes temporary files.
- Does not retain user information.

The backend must remain stateless between requests.

If a resume profile is needed for another API call, the frontend can send the structured profile again.

Add reasonable request-size limits and do not log resume contents or personal information.

---

# 10. ERROR HANDLING AND USER EXPERIENCE

Handle these cases:

- Invalid resume format.
- Resume larger than 10 MB.
- Empty or unreadable resume.
- Scanned PDF without OCR support.
- AI provider unavailable.
- Invalid AI response.
- Job API unavailable.
- No matching jobs.
- No recruiter information found.
- Network timeout.
- Invalid application link.
- Rate limits.

Show understandable messages instead of raw server errors.

Add:
- Loading indicators.
- Skeleton job cards.
- Empty states.
- Retry buttons.
- Success notifications.
- Responsive layouts.

---

# 11. SECURITY

Even though there is no database, security is still important.

Implement:

- API keys stored in backend .env.
- .env excluded from Git.
- File extension and MIME-type validation.
- File size validation.
- Temporary file cleanup.
- CORS restricted to configured frontend origins.
- Request timeouts.
- Rate limiting where appropriate.
- Safe error messages.
- Input validation.
- No sensitive resume information in logs.
- No secret keys in frontend code.

Do not claim the system is production-secure without testing these controls.

---

# 12. PROJECT FOLDER STRUCTURE

Use a modular structure.

job-hunter/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── MatchScore.jsx
│   │   │   └── ContactCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyResume.jsx
│   │   │   ├── FindJobs.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   └── SavedJobs.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   │
│   │   ├── routes/
│   │   │   ├── resume.py
│   │   │   ├── jobs.py
│   │   │   └── contacts.py
│   │   │
│   │   ├── services/
│   │   │   ├── resume_parser.py
│   │   │   ├── resume_analyzer.py
│   │   │   ├── job_discovery.py
│   │   │   ├── arbeitnow_service.py
│   │   │   ├── remotive_service.py
│   │   │   ├── adzuna_service.py
│   │   │   ├── matching_engine.py
│   │   │   └── contact_discovery.py
│   │   │
│   │   ├── models/
│   │   │   ├── resume.py
│   │   │   ├── job.py
│   │   │   └── contact.py
│   │   │
│   │   └── utils/
│   │
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py
│
├── .gitignore
└── README.md

Models in this structure must be Pydantic data schemas, not database models.

---

# 13. ENVIRONMENT VARIABLES

Backend .env.example:

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_supported_model
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
FRONTEND_URL=http://localhost:5173

Only configure credentials for providers that are actually integrated.

Frontend .env.example:

VITE_API_URL=http://localhost:8000

Never put GROQ_API_KEY or other private credentials in frontend environment variables.

---

# 14. DEPLOYMENT

Frontend:
- Deploy on Vercel.
- Configure VITE_API_URL to point to the deployed backend.

Backend:
- Deploy on Render.
- Configure GROQ_API_KEY and other provider secrets in Render environment settings.
- Configure the frontend origin in CORS.
- Add a health-check endpoint.
- Use a production Uvicorn start command.

No database deployment is required.

Include:
- Local setup instructions.
- Environment setup.
- Backend start command.
- Frontend start command.
- Deployment instructions.
- Troubleshooting guide.

---

# 15. DEVELOPMENT EXECUTION STRATEGY

Do not attempt to generate the entire application in one enormous response.

Build it in phases.

Phase 1: Project initialization and frontend dashboard.

Phase 2: FastAPI backend initialization and health endpoint.

Phase 3: Resume upload and parsing.

Phase 4: AI resume analysis.

Phase 5: Job API integrations.

Phase 6: Resume-to-job matching engine.

Phase 7: Company and recruiter contact discovery.

Phase 8: Saved jobs and application tracking with localStorage.

Phase 9: Frontend-backend integration.

Phase 10: Testing, security review, and deployment.

For every phase:

1. Explain what you are implementing.
2. Provide exact terminal commands.
3. Create complete working files.
4. Explain the responsibility of each important file.
5. Explain how frontend and backend communicate.
6. Provide test cases.
7. Run or describe the necessary tests.
8. Verify the phase before proceeding.

Do not leave placeholder functions for core features.

If a third-party API requires credentials, explain how to obtain them and provide a working integration when credentials are configured.

If an external source cannot provide the requested information, explain the limitation and provide a legitimate fallback.

Do not invent API endpoints, job listings, contact details, or successful test results.

---

# 16. FINAL EXPECTED RESULT

I want a fully working AI Job Hunter Portal where:

- A user can upload a resume.
- Resume details are automatically extracted.
- AI identifies skills, experience, and suitable job roles.
- The application searches external job sources.
- Jobs are evaluated against the uploaded resume.
- Each job has an explainable match score.
- Matching and missing skills are displayed.
- Every job has a direct application link.
- Company details are displayed.
- Publicly verifiable recruiter information is displayed when available.
- LinkedIn recruiter search links are provided as a fallback.
- Users can save jobs.
- Users can track application status.
- The application is responsive.
- The frontend is deployed on Vercel.
- The backend is deployed on Render.
- There is absolutely no custom database.

Start with Phase 1.

Before writing code, explain the architecture briefly and list the initial setup commands. Then implement Phase 1 with complete, runnable code.

Remember: prioritize working functionality, clean architecture, security, and beginner-friendly explanations over unnecessary complexity.