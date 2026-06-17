from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth.router import get_current_user
from contacts.models import Contact
from pipeline.models import Deal
from contracts.models import Contract
from support.models import Ticket

router = APIRouter()

PIPELINE_STAGES = ["lead", "qualified", "proposal", "negotiation", "won", "lost"]
CONTRACT_STATUSES = ["draft", "active", "expired", "cancelled"]


@router.get("/summary")
def summary(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return {
        "contacts": db.query(Contact).filter(Contact.type == "contact").count(),
        "leads": db.query(Contact).filter(Contact.type == "lead").count(),
        "open_deals": db.query(Deal).filter(Deal.stage.notin_(["won", "lost"])).count(),
        "active_contracts": db.query(Contract).filter(Contract.status == "active").count(),
        "open_tickets": db.query(Ticket).filter(Ticket.status.notin_(["resolved", "closed"])).count(),
    }


@router.get("/pipeline")
def pipeline_stats(db: Session = Depends(get_db), _=Depends(get_current_user)):
    result = {}
    for stage in PIPELINE_STAGES:
        deals = db.query(Deal).filter(Deal.stage == stage).all()
        result[stage] = {
            "count": len(deals),
            "total_value": sum(d.value for d in deals),
        }
    return result


@router.get("/contracts")
def contracts_stats(db: Session = Depends(get_db), _=Depends(get_current_user)):
    result = {}
    for status in CONTRACT_STATUSES:
        contracts = db.query(Contract).filter(Contract.status == status).all()
        result[status] = {
            "count": len(contracts),
            "total_value": sum(c.value for c in contracts),
        }
    return result
