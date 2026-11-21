import urllib.parse
from typing import Optional
from app.models.contact import ContactInfo

class ContactDiscoveryService:
    @staticmethod
    def discover_contacts(company: str, title: Optional[str] = "Recruiter") -> ContactInfo:
        clean_company = company.strip()
        encoded_company = urllib.parse.quote(clean_company)
        
        # Generate official LinkedIn Search Link for internal recruiters
        linkedin_search_url = (
            f"https://www.linkedin.com/search/results/people/?keywords=Talent%20Acquisition%20{encoded_company}"
        )
        
        company_linkedin_url = (
            f"https://www.linkedin.com/search/results/companies/?keywords={encoded_company}"
        )

        return ContactInfo(
            company=clean_company,
            contact_name=None, # Never fabricate without confirmed public API source
            designation="Talent Acquisition / HR",
            email=None,        # Never guess emails
            phone=None,        # Never guess phone numbers
            linkedin_url=linkedin_search_url,
            company_website=None,
            company_linkedin=company_linkedin_url,
            source_url=linkedin_search_url,
            verification_status="Search link provided (Contact not directly published)"
        )

contact_discovery_service = ContactDiscoveryService()
