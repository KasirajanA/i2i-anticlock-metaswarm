from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class ContractBase(BaseModel):
    title: str
    client_name: Optional[str] = None
    value: float = 0.0
    status: str = "draft"
    contact_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    title: Optional[str] = None
    client_name: Optional[str] = None
    value: Optional[float] = None
    status: Optional[str] = None
    contact_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ContractOut(ContractBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
