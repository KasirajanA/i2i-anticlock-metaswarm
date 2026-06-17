from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ContactBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    type: str = "contact"
    status: str = "active"


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None


class ContactOut(ContactBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
