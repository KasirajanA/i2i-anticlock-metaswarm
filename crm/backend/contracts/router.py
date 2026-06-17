from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth.router import get_current_user
from .models import Contract
from .schemas import ContractCreate, ContractUpdate, ContractOut

router = APIRouter()


@router.get("/", response_model=List[ContractOut])
def list_contracts(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Contract).all()


@router.post("/", response_model=ContractOut, status_code=201)
def create_contract(data: ContractCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    contract = Contract(**data.model_dump())
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract


@router.put("/{id}", response_model=ContractOut)
def update_contract(id: int, data: ContractUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    contract = db.query(Contract).filter(Contract.id == id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(contract, key, value)
    db.commit()
    db.refresh(contract)
    return contract


@router.delete("/{id}", status_code=204)
def delete_contract(id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    contract = db.query(Contract).filter(Contract.id == id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    db.delete(contract)
    db.commit()
