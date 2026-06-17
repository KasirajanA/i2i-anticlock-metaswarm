from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base


class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    value = Column(Float, default=0.0)
    stage = Column(String, default="lead")  # lead | qualified | proposal | won | lost
    contact_id = Column(Integer, ForeignKey("contacts.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
