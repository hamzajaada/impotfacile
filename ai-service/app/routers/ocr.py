import io
from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel

router = APIRouter()


class OCRResult(BaseModel):
    filename: str
    data_type: str
    extracted_fields: dict
    confidence: float


@router.post("/extract", response_model=OCRResult)
async def extract_document_data(file: UploadFile = File(...)):
    content = await file.read()

    extracted = {
        "filename": file.filename,
        "data_type": "T4",
        "extracted_fields": {
            "employer_name": "(en attente OCR)",
            "employee_sin": "(en attente OCR)",
            "box_14_employment_income": 0,
            "box_16_cpp_contributions": 0,
            "box_18_ei_premiums": 0,
            "box_22_income_tax_deducted": 0,
        },
        "confidence": 0.0,
    }

    return OCRResult(**extracted)
