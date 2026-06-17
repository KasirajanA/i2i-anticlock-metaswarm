from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from database import get_db
from auth.router import get_current_user
from .models import Contact
from .schemas import ContactCreate, ContactUpdate, ContactOut

router = APIRouter()


@router.get("/", response_model=List[ContactOut])
def list_contacts(
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    query = db.query(Contact)
    if type:
        query = query.filter(Contact.type == type)
    if status:
        query = query.filter(Contact.status == status)
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                Contact.name.ilike(like),
                Contact.email.ilike(like),
                Contact.company.ilike(like),
            )
        )
    return query.all()


@router.post("/", response_model=ContactOut, status_code=201)
def create_contact(data: ContactCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    if data.email and db.query(Contact).filter(Contact.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already in use")
    contact = Contact(**data.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.get("/{id}", response_model=ContactOut)
def get_contact(id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    contact = db.query(Contact).filter(Contact.id == id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@router.put("/{id}", response_model=ContactOut)
def update_contact(id: int, data: ContactUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    contact = db.query(Contact).filter(Contact.id == id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    updates = data.model_dump(exclude_none=True)
    if "email" in updates and updates["email"] != contact.email:
        if db.query(Contact).filter(Contact.email == updates["email"]).first():
            raise HTTPException(status_code=400, detail="Email already in use")
    for key, value in updates.items():
        setattr(contact, key, value)
    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/{id}", status_code=204)
def delete_contact(id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    contact = db.query(Contact).filter(Contact.id == id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
