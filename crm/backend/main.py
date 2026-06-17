from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine

from auth.router import router as auth_router
from contacts.router import router as contacts_router
from pipeline.router import router as pipeline_router
from contracts.router import router as contracts_router
from support.router import router as support_router
from reporting.router import router as reporting_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CRM API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(contacts_router, prefix="/contacts", tags=["contacts"])
app.include_router(pipeline_router, prefix="/pipeline", tags=["pipeline"])
app.include_router(contracts_router, prefix="/contracts", tags=["contracts"])
app.include_router(support_router, prefix="/support", tags=["support"])
app.include_router(reporting_router, prefix="/reporting", tags=["reporting"])


@app.get("/health")
def health():
    return {"status": "ok"}
