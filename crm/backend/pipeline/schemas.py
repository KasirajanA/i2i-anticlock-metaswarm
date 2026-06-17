from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, Literal


class DealBase(BaseModel):
    title: str
    value: float = 0.0
    stage: Literal["lead", "qualified", "proposal", "negotiation", "won", "lost"] = "lead"
    contact_id: Optional[int] = None
    expected_close_date: Optional[date] = None
    notes: Optional[str] = None


class DealCreate(DealBase):
    pass


class DealUpdate(BaseModel):
    title: Optional[str] = None
    value: Optional[float] = None
    stage: Optional[Literal["lead", "qualified", "proposal", "negotiation", "won", "lost"]] = None
    contact_id: Optional[int] = None
    expected_close_date: Optional[date] = None
    notes: Optional[str] = None


class DealOut(DealBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
