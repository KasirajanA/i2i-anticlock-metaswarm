from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth.router import get_current_user
from .models import Ticket
from .schemas import TicketCreate, TicketUpdate, TicketOut

router = APIRouter()


@router.get("/", response_model=List[TicketOut])
def list_tickets(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Ticket).all()


@router.post("/", response_model=TicketOut, status_code=201)
def create_ticket(data: TicketCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    ticket = Ticket(**data.model_dump())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.put("/{id}", response_model=TicketOut)
def update_ticket(id: int, data: TicketUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    for key, value in data.model_dump(exclude_none=True).items():
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
