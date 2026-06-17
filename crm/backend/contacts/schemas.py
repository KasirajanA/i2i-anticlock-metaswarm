from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal


class ContactBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    type: Literal["lead", "contact"] = "lead"
    status: Literal["active", "inactive"] = "active"
    notes: Optional[str] = None


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    type: Optional[Literal["lead", "contact"]] = None
    status: Optional[Literal["active", "inactive"]] = None
    notes: Optional[str] = None


class ContactOut(ContactBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
