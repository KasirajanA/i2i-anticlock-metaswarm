from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal


class TicketBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Literal["open", "in_progress", "resolved", "closed"] = "open"
    priority: Literal["low", "medium", "high", "urgent"] = "medium"
    contact_id: Optional[int] = None


class TicketCreate(TicketBase):
    pass


class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal["open", "in_progress", "resolved", "closed"]] = None
    priority: Optional[Literal["low", "medium", "high", "urgent"]] = None
    contact_id: Optional[int] = None


class TicketOut(TicketBase):
    id: int
    resolved_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}
