from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DealBase(BaseModel):
    title: str
    value: float = 0.0
    stage: str = "lead"
    contact_id: Optional[int] = None


class DealCreate(DealBase):
    pass


class DealUpdate(BaseModel):
    title: Optional[str] = None
    value: Optional[float] = None
    stage: Optional[str] = None
    contact_id: Optional[int] = None


class DealOut(DealBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
