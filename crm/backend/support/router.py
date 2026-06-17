from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List, Optional
from database import get_db
from auth.router import get_current_user
from .models import Ticket
from .schemas import TicketCreate, TicketUpdate, TicketOut

router = APIRouter()

RESOLVED_STATUSES = {"resolved", "closed"}


@router.get("/", response_model=List[TicketOut])
def list_tickets(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    contact_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    query = db.query(Ticket)
    if status:
        query = query.filter(Ticket.status == status)
    if priority:
        query = query.filter(Ticket.priority == priority)
    if contact_id:
        query = query.filter(Ticket.contact_id == contact_id)
    return query.all()


@router.post("/", response_model=TicketOut, status_code=201)
def create_ticket(data: TicketCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    ticket = Ticket(**data.model_dump())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.get("/{id}", response_model=TicketOut)
def get_ticket(id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.put("/{id}", response_model=TicketOut)
def update_ticket(id: int, data: TicketUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    updates = data.model_dump(exclude_none=True)
    new_status = updates.get("status")
    if new_status and new_status in RESOLVED_STATUSES and ticket.resolved_at is None:
        ticket.resolved_at = datetime.now(timezone.utc)
    for key, value in updates.items():
        setattr(ticket, key, value)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.delete("/{id}", status_code=204)
def delete_ticket(id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()
