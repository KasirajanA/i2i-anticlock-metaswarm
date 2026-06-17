from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, index=True)
    phone = Column(String)
    company = Column(String)
    type = Column(String, default="contact")   # contact | lead
    status = Column(String, default="active")  # active | inactive
    created_at = Column(DateTime, server_default=func.now())
