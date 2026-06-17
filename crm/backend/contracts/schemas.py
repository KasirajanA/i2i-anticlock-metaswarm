from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, Literal


class ContractBase(BaseModel):
    title: str
    client_name: Optional[str] = None
    value: float = 0.0
    status: Literal["draft", "active", "expired", "cancelled"] = "draft"
    contact_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    title: Optional[str] = None
    client_name: Optional[str] = None
    value: Optional[float] = None
    status: Optional[Literal["draft", "active", "expired", "cancelled"]] = None
    contact_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None


class ContractOut(ContractBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
