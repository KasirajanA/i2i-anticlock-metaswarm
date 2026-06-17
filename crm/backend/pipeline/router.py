from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from auth.router import get_current_user
from .models import Deal
from .schemas import DealCreate, DealUpdate, DealOut

router = APIRouter()


@router.get("/", response_model=List[DealOut])
def list_deals(
    stage: Optional[str] = Query(None),
    contact_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    query = db.query(Deal)
    if stage:
        query = query.filter(Deal.stage == stage)
    if contact_id:
        query = query.filter(Deal.contact_id == contact_id)
    return query.all()


@router.post("/", response_model=DealOut, status_code=201)
def create_deal(data: DealCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    deal = Deal(**data.model_dump())
    db.add(deal)
    db.commit()
    db.refresh(deal)
    return deal


@router.get("/{id}", response_model=DealOut)
def get_deal(id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    deal = db.query(Deal).filter(Deal.id == id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    return deal


@router.put("/{id}", response_model=DealOut)
def update_deal(id: int, data: DealUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    deal = db.query(Deal).filter(Deal.id == id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(deal, key, value)
    db.commit()
    db.refresh(deal)
    return deal


@router.delete("/{id}", status_code=204)
def delete_deal(id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    deal = db.query(Deal).filter(Deal.id == id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    db.delete(deal)
    db.commit()
