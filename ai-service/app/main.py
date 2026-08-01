from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import estimation, ocr

app = FastAPI(
    title="ImpotFacile AI Service",
    description="OCR and tax estimation microservice",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(estimation.router, prefix="/api/estimate", tags=["Estimation"])
app.include_router(ocr.router, prefix="/api/ocr", tags=["OCR"])


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
