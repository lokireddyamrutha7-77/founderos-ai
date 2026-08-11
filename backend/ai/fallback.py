"""Validated fallback response for the FounderOS Advisor demo."""

from .schemas import AdvisorReport


DEMO_FALLBACK_IDEA = (
    "An AI-powered bookkeeping assistant for small retail businesses "
    "that categorizes expenses, tracks cash flow, and produces simple "
    "weekly financial summaries."
)


DEMO_FALLBACK_REPORT = {
    "idea_score": 68,
    "market_validation": (
        "Small retail businesses often manage bookkeeping manually or rely "
        "on software that requires significant accounting knowledge. The "
        "main assumptions to validate are whether owners will trust automated "
        "categorization and whether they will pay for simplified weekly "
        "financial summaries. Interview at least 15 independent retailers "
        "and test a manually prepared weekly report before building the "
        "complete product."
    ),
    "competitors": [
        {
            "name": "QuickBooks",
            "weakness": (
                "Its broad accounting feature set can feel complicated for "
                "small retailers without accounting experience."
            ),
            "advantage": (
                "FounderOS could provide a simpler retail-focused experience "
                "with automated weekly summaries and guided actions."
            ),
        },
        {
            "name": "Xero",
            "weakness": (
                "Setup and daily bookkeeping workflows may still require "
                "accounting knowledge or professional assistance."
            ),
            "advantage": (
                "FounderOS could reduce setup effort by focusing on essential "
                "cash-flow and expense insights for early-stage retailers."
            ),
        },
        {
            "name": "Manual spreadsheets",
            "weakness": (
                "Spreadsheets require repeated data entry and are vulnerable "
                "to inconsistent categorization and human error."
            ),
            "advantage": (
                "FounderOS could automate repetitive work while keeping the "
                "reports as understandable as a familiar spreadsheet."
            ),
        },
    ],
    "swot": {
        "strengths": [
            "Clear focus on small retail bookkeeping workflows",
            "Potential to reduce repetitive manual financial administration",
            "Weekly summaries can make financial information easier to act on",
        ],
        "weaknesses": [
            "The product depends on accurate transaction categorization",
            "Founders must earn trust before handling sensitive financial data",
            "Integrations with banks and accounting tools may be difficult",
        ],
        "opportunities": [
            "Offer guided cash-flow monitoring for non-accountants",
            "Partner with independent bookkeepers and retail associations",
            "Expand into forecasting after validating the core reporting workflow",
        ],
        "threats": [
            "Established accounting platforms could add similar simplified features",
            "Incorrect financial categorization could damage customer trust",
            "Privacy, security, and financial-data compliance requirements may increase costs",
        ],
    },
    "business_model": (
        "Use a monthly subscription model with a low-cost starter tier for "
        "single-store retailers and a higher tier for multiple locations or "
        "advanced reporting. Major costs include Gemini usage, financial-data "
        "integrations, security, customer support, and product development. "
        "Validate willingness to pay and support costs before assuming strong "
        "unit economics."
    ),
    "revenue_suggestions": [
        "Charge a monthly subscription for automated bookkeeping summaries",
        "Offer a higher-priced tier for multi-store reporting and cash-flow forecasts",
        "Provide optional paid onboarding or bookkeeping review through qualified partners",
    ],
    "growth_strategy": [
        "Days 1-30: Interview independent retailers, identify their most frequent bookkeeping problems, and deliver manual sample reports.",
        "Days 31-60: Run a small pilot with early users, measure time saved, and improve categorization based on corrections.",
        "Days 61-90: Convert successful pilot users into paying customers and test partnerships with bookkeepers or retail communities.",
    ],
    "legal_considerations": (
        "Consider general categories including business registration, tax "
        "registration, licensing, privacy and data protection, employment "
        "obligations, and industry compliance. Exact requirements vary by "
        "jurisdiction, so consult a licensed professional in your area."
    ),
    "next_steps": [
        "Interview at least 15 independent retail business owners",
        "Identify the three bookkeeping tasks that consume the most time",
        "Create a manual example of the proposed weekly financial summary",
        "Test willingness to pay with a small pilot offer",
        "Measure categorization accuracy, time saved, and repeat usage",
    ],
}


def get_demo_fallback_report() -> dict:
    """Return a schema-validated copy of the fallback Advisor report."""

    validated_report = AdvisorReport.model_validate(DEMO_FALLBACK_REPORT)
    return validated_report.model_dump()