from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth.router import get_current_user
from contacts.models import Contact
from pipeline.models import Deal
from contracts.models import Contract
from support.models import Ticket

router = APIRouter()


@router.get("/summary")
def summary(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return {
        "contacts": db.query(Contact).filter(Contact.type == "contact").count(),
        "leads": db.query(Contact).filter(Contact.type == "lead").count(),
        "open_deals": db.query(Deal).filter(Deal.stage.notin_(["won", "lost"])).count(),
        "active_contracts": db.query(Contract).filter(Contract.status == "active").count(),
        "open_tickets": db.query(Ticket).filter(Ticket.status != "closed").count(),
    }


@router.get("/pipeline")
def pipeline_stats(db: Session = Depends(get_db), _=Depends(get_current_user)):
    stages = ["lead", "qualified", "proposal", "won", "lost"]
    return {
        stage: db.query(Deal).filter(Deal.stage == stage).count()
        for stage in stages
    }
