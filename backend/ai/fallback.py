"""
Validated cached response for demo-day safety.

This fallback is intended only for the known FounderOS demo idea.
It should not be presented as a live Gemini response.
"""

from backend.ai.schemas import AdvisorReport


DEMO_FALLBACK_IDEA = (
    "An AI-powered CRM designed specifically for "
    "independent real-estate agents."
)


DEMO_FALLBACK_REPORT = {
    "idea_score": 68,

    "market_validation": (
        "Independent real-estate agents frequently manage leads, "
        "follow-ups, appointments, and client communication across "
        "multiple tools. The main assumptions to validate are whether "
        "agents will switch from their existing workflow and whether "
        "they will pay for specialized automation. Conduct customer "
        "interviews and test a clickable prototype before development."
    ),

    "competitors": [
        {
            "name": "HubSpot",
            "weakness": (
                "Its broad feature set may be unnecessarily complex "
                "for independent real-estate agents."
            ),
            "advantage": (
                "The proposed product can provide a simpler workflow "
                "designed specifically for individual agents."
            ),
        },
        {
            "name": "Salesforce",
            "weakness": (
                "Implementation and configuration may be costly and "
                "time-consuming for small teams."
            ),
            "advantage": (
                "The proposed product can offer faster setup and "
                "more accessible pricing."
            ),
        },
        {
            "name": "Spreadsheets and manual reminders",
            "weakness": (
                "They require manual updates and provide limited "
                "automation or follow-up intelligence."
            ),
            "advantage": (
                "The proposed product can automate lead tracking, "
                "reminders, and communication workflows."
            ),
        },
    ],

    "swot": {
        "strengths": [
            "Clearly defined customer segment",
            "Recurring lead-management problem",
            "Subscription revenue potential",
        ],
        "weaknesses": [
            "Crowded CRM market",
            "Dependence on customer workflow changes",
            "Unproven willingness to pay",
        ],
        "opportunities": [
            "Brokerage partnership opportunities",
            "Mobile-first agent workflows",
            "AI-assisted follow-up automation",
        ],
        "threats": [
            "Existing CRM vendors adding similar features",
            "Customer resistance to changing tools",
            "Data privacy and security concerns",
        ],
    },

    "business_model": (
        "Use a monthly SaaS subscription model with a basic plan "
        "for individual agents, a team plan for brokerages, and "
        "optional paid AI automation features. Validate customer "
        "acquisition cost, monthly retention, and support costs."
    ),

    "revenue_suggestions": [
        "Monthly subscriptions for individual agents",
        "Team subscriptions for brokerages",
        "Premium AI automation and reporting add-ons",
    ],

    "growth_strategy": [
        (
            "Days 1-30: interview agents, identify their highest-cost "
            "workflow problem, and test a clickable prototype."
        ),
        (
            "Days 31-60: run a small paid pilot and measure activation, "
            "weekly usage, and willingness to continue paying."
        ),
        (
            "Days 61-90: improve retention, test customer referrals, "
            "and explore general brokerage partnership channels."
        ),
    ],

    "legal_considerations": (
        "Consider general business registration, applicable sales tax "
        "or GST registration, software terms of service, privacy and "
        "data-protection requirements, and any relevant industry "
        "licensing categories. Requirements differ by jurisdiction, "
        "so consult a licensed professional in your area."
    ),

    "next_steps": [
        "Interview at least 15 independent real-estate agents",
        "Identify the most expensive recurring workflow problem",
        "Build a clickable prototype of the core workflow",
        "Test pricing and willingness to pay with five agents",
        "Run a small paid pilot and measure repeat usage",
    ],
}


def get_demo_fallback_report() -> dict:
    """
    Validate and return a fresh copy of the cached demo response.
    """

    validated_report = AdvisorReport.model_validate(
        DEMO_FALLBACK_REPORT
    )

    return validated_report.model_dump(mode="json")