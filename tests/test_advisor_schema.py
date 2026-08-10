import copy
import unittest

from pydantic import ValidationError

from backend.ai.gemini_client import analyze_startup_idea
from backend.ai.schemas import AdvisorReport


def create_valid_report() -> dict:
    """
    Return a complete valid nine-field Advisor report.
    """

    return {
        "idea_score": 68,

        "market_validation": (
            "Independent real-estate agents need simpler customer "
            "management, but their willingness to pay and preferred "
            "workflow must be validated through interviews and a pilot."
        ),

        "competitors": [
            {
                "name": "HubSpot",
                "weakness": (
                    "Its broad feature set can be complex for "
                    "independent agents."
                ),
                "advantage": (
                    "The proposed product offers a simpler "
                    "real-estate-specific workflow."
                ),
            },
            {
                "name": "Salesforce",
                "weakness": (
                    "It can be expensive and difficult for small "
                    "teams to configure."
                ),
                "advantage": (
                    "The proposed product offers lower cost and "
                    "faster setup."
                ),
            },
            {
                "name": "Spreadsheets",
                "weakness": (
                    "They require manual updates and do not provide "
                    "automatic follow-up reminders."
                ),
                "advantage": (
                    "The proposed product automates lead tracking "
                    "and follow-up activities."
                ),
            },
        ],

        "swot": {
            "strengths": [
                "Clear customer niche",
                "Recurring workflow problem",
                "Subscription revenue potential",
            ],
            "weaknesses": [
                "Crowded CRM market",
                "Limited initial customer data",
                "Customer-acquisition uncertainty",
            ],
            "opportunities": [
                "Brokerage partnerships",
                "Mobile-first workflows",
                "AI follow-up automation",
            ],
            "threats": [
                "Established CRM companies",
                "High customer churn",
                "Data-privacy concerns",
            ],
        },

        "business_model": (
            "Monthly SaaS subscriptions with separate plans for "
            "individual agents and brokerage teams."
        ),

        "revenue_suggestions": [
            "Individual-agent monthly subscriptions",
            "Brokerage team plans",
            "Premium AI automation add-ons",
        ],

        "growth_strategy": [
            "Days 1-30: interview agents and test a prototype.",
            "Days 31-60: run a paid pilot with one brokerage.",
            "Days 61-90: test referrals and brokerage partnerships.",
        ],

        "legal_considerations": (
            "Consider general business registration, applicable sales "
            "tax or GST registration, data-protection requirements, "
            "software terms, and any relevant industry permits. "
            "Consult a licensed professional in your area."
        ),

        "next_steps": [
            "Interview 15 independent agents",
            "Identify their most expensive workflow problem",
            "Build a clickable prototype",
            "Test pricing with five agents",
            "Run a small paid pilot",
        ],
    }


class AdvisorSchemaTests(unittest.TestCase):

    def test_valid_report_passes(self):
        report = AdvisorReport.model_validate(
            create_valid_report()
        )

        self.assertEqual(report.idea_score, 68)

    def test_exactly_nine_fields_are_returned(self):
        report = AdvisorReport.model_validate(
            create_valid_report()
        )

        expected_fields = {
            "idea_score",
            "market_validation",
            "competitors",
            "swot",
            "business_model",
            "revenue_suggestions",
            "growth_strategy",
            "legal_considerations",
            "next_steps",
        }

        self.assertEqual(
            set(report.model_dump().keys()),
            expected_fields,
        )

        self.assertEqual(
            len(report.model_dump()),
            9,
        )

    def test_score_above_100_is_rejected(self):
        invalid_report = create_valid_report()
        invalid_report["idea_score"] = 120

        with self.assertRaises(ValidationError):
            AdvisorReport.model_validate(invalid_report)

    def test_missing_next_steps_is_rejected(self):
        invalid_report = create_valid_report()
        invalid_report.pop("next_steps")

        with self.assertRaises(ValidationError):
            AdvisorReport.model_validate(invalid_report)

    def test_missing_legal_considerations_is_rejected(self):
        invalid_report = create_valid_report()
        invalid_report.pop("legal_considerations")

        with self.assertRaises(ValidationError):
            AdvisorReport.model_validate(invalid_report)

    def test_extra_field_is_rejected(self):
        invalid_report = create_valid_report()
        invalid_report["unexpected_field"] = "Not allowed"

        with self.assertRaises(ValidationError):
            AdvisorReport.model_validate(invalid_report)

    def test_incorrect_competitor_type_is_rejected(self):
        invalid_report = create_valid_report()

        invalid_report["competitors"] = [
            "HubSpot",
            "Salesforce",
            "Spreadsheets",
        ]

        with self.assertRaises(ValidationError):
            AdvisorReport.model_validate(invalid_report)

    def test_incorrect_swot_count_is_rejected(self):
        invalid_report = copy.deepcopy(
            create_valid_report()
        )

        invalid_report["swot"]["strengths"] = [
            "Only one strength"
        ]

        with self.assertRaises(ValidationError):
            AdvisorReport.model_validate(invalid_report)

    def test_short_startup_idea_is_rejected_without_api_call(self):
        with self.assertRaises(ValueError):
            analyze_startup_idea("app")


if __name__ == "__main__":
    unittest.main()