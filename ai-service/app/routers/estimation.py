from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class EstimateRequest(BaseModel):
    annual_income: float
    deductions: float = 0
    tax_profile: str = "INDIVIDUAL"
    province: str = "QC"


class EstimateResponse(BaseModel):
    estimated_tax: float
    estimated_refund: float
    effective_rate: float
    marginal_rate: float
    brackets: list[dict]


QC_TAX_BRACKETS = [
    (51780, 0.14),
    (103545, 0.1998),
    (126000, 0.2498),
    (179063, 0.2998),
    (float("inf"), 0.3325),
]

FEDERAL_TAX_BRACKETS = [
    (55867, 0.15),
    (111733, 0.205),
    (154906, 0.26),
    (220000, 0.29),
    (float("inf"), 0.33),
]


def calculate_tax_for_brackets(income: float, brackets: list[tuple[float, float]]) -> tuple[float, list[dict]]:
    tax = 0
    details = []
    prev_limit = 0

    for limit, rate in brackets:
        taxable_in_bracket = min(income, limit) - prev_limit
        if taxable_in_bracket <= 0:
            break
        tax_in_bracket = taxable_in_bracket * rate
        tax += tax_in_bracket
        details.append({
            "bracket": f"${prev_limit:,.0f} - ${limit:,.0f}" if limit != float("inf") else f"${prev_limit:,.0f}+",
            "rate": f"{rate * 100:.2f}%",
            "taxable": round(taxable_in_bracket, 2),
            "tax": round(tax_in_bracket, 2),
        })
        prev_limit = limit

    return tax, details


@router.post("/tax", response_model=EstimateResponse)
async def estimate_tax(request: EstimateRequest):
    income = max(0, request.annual_income - request.deductions)

    federal_tax, federal_details = calculate_tax_for_brackets(income, FEDERAL_TAX_BRACKETS)
    qc_tax, qc_details = calculate_tax_for_brackets(income, QC_TAX_BRACKETS)

    total_tax = federal_tax + qc_tax
    effective_rate = (total_tax / request.annual_income * 100) if request.annual_income > 0 else 0

    bracket_details = []
    for d in federal_details:
        bracket_details.append({"level": "federal", **d})
    for d in qc_details:
        bracket_details.append({"level": "quebec", **d})

    estimated_refund = 0
    if request.tax_profile == "STUDENT":
        estimated_refund += min(1500, income * 0.15)
    elif request.tax_profile == "SENIOR":
        estimated_refund += min(2000, income * 0.10)

    return EstimateResponse(
        estimated_tax=round(total_tax, 2),
        estimated_refund=round(estimated_refund, 2),
        effective_rate=round(effective_rate, 2),
        marginal_rate=29.98,
        brackets=bracket_details,
    )
