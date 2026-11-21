from fastapi import APIRouter
from app.models.contact import ContactSearchRequest, ContactInfo
from app.services.contact_discovery import contact_discovery_service

router = APIRouter(prefix="/api/contacts", tags=["Contacts"])

@router.post("/search", response_model=ContactInfo)
async def search_contacts(payload: ContactSearchRequest):
    """
    Returns publicly verifiable recruiter contacts or official LinkedIn search links.
    """
    return contact_discovery_service.discover_contacts(payload.company, payload.title)
