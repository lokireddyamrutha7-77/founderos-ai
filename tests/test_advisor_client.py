"""Offline unit tests for backend.ai.gemini_client."""

import os
import unittest
from unittest.mock import MagicMock, patch

from backend.ai.gemini_client import (
    DEFAULT_MODEL,
    AdvisorGenerationError,
    analyze_startup_idea,
    get_gemini_client,
)
from backend.ai.schemas import AdvisorReport


class FakeAPIError(Exception):
    """Test double for google.genai.errors.APIError."""

    def __init__(self, code: int = 500) -> None:
        super().__init__(f"Fake API Error {code}")
        self.code = code


def create_valid_report_dict() -> dict:
    return {
        "idea_score": 75,
        "market_validation": "Good market fit for niche users.",
        "competitors": [
            {"name": "CompA", "weakness": "Slow", "advantage": "Fast setup"},
            {"name": "CompB", "weakness": "Expensive", "advantage": "Cheap"},
            {"name": "CompC", "weakness": "Legacy", "advantage": "Modern UI"},
        ],
        "swot": {
            "strengths": ["Agile", "Low cost", "Simple"],
            "weaknesses": ["New brand", "Small team", "No funding"],
            "opportunities": ["Unserved niche", "API integrations", "Viral referral"],
            "threats": ["Big players", "Copycats", "Regulation"],
        },
        "business_model": "SaaS monthly subscription",
        "revenue_suggestions": [
            "Starter plan ($19/mo)",
            "Pro plan ($49/mo)",
            "Enterprise custom billing",
        ],
        "growth_strategy": [
            "Days 1-30: Validate MVP with 10 users.",
            "Days 31-60: Launch beta on Product Hunt.",
            "Days 61-90: Scale paid acquisition.",
        ],
        "legal_considerations": (
            "General business setup and data protection regulations apply. "
            "Consult a licensed professional in your area."
        ),
        "next_steps": [
            "Interview 10 prospects",
            "Build landing page",
            "Set up analytics",
            "Pre-sell 5 subscriptions",
            "Launch private v1",
        ],
    }


class AdvisorClientTests(unittest.TestCase):

    def setUp(self) -> None:
        self.valid_env = {
            "GEMINI_API_KEY": "test-key-123",
            "GEMINI_MODEL": DEFAULT_MODEL,
        }

    def test_short_idea_rejected(self) -> None:
        with self.assertRaises(ValueError) as ctx:
            analyze_startup_idea("Short")
        self.assertIn("at least 10 characters", str(ctx.exception))

    def test_long_idea_rejected(self) -> None:
        with self.assertRaises(ValueError) as ctx:
            analyze_startup_idea("A" * 5001)
        self.assertIn("at most 5,000 characters", str(ctx.exception))

    def test_missing_api_key_raises_value_error(self) -> None:
        with patch.dict(os.environ, {"GEMINI_API_KEY": ""}, clear=False):
            with self.assertRaises(ValueError) as ctx:
                get_gemini_client()
            self.assertIn("GEMINI_API_KEY is missing", str(ctx.exception))

    def test_successful_analysis(self) -> None:
        valid_dict = create_valid_report_dict()
        valid_report = AdvisorReport.model_validate(valid_dict)

        mock_response = MagicMock()
        mock_response.text = valid_report.model_dump_json()

        mock_client_inst = MagicMock()
        mock_client_inst.models.generate_content.return_value = mock_response

        with patch.dict(os.environ, self.valid_env, clear=False), \
             patch("backend.ai.gemini_client.get_gemini_client", return_value=mock_client_inst):

            res = analyze_startup_idea("A valid startup idea for testing purposes.")
            self.assertEqual(res["idea_score"], 75)
            self.assertEqual(len(res), 9)
            self.assertEqual(len(res["competitors"]), 3)

    def test_empty_response_raises_advisor_generation_error(self) -> None:
        mock_response = MagicMock()
        mock_response.text = ""

        mock_client_inst = MagicMock()
        mock_client_inst.models.generate_content.return_value = mock_response

        with patch.dict(os.environ, self.valid_env, clear=False), \
             patch("backend.ai.gemini_client.get_gemini_client", return_value=mock_client_inst):

            with self.assertRaises(AdvisorGenerationError) as ctx:
                analyze_startup_idea("A valid startup idea for testing purposes.")
            self.assertIn("empty response", str(ctx.exception))

    def test_api_error_raises_advisor_generation_error(self) -> None:
        mock_client_inst = MagicMock()
        mock_client_inst.models.generate_content.side_effect = FakeAPIError(429)

        with patch.dict(os.environ, self.valid_env, clear=False), \
             patch("backend.ai.gemini_client.get_gemini_client", return_value=mock_client_inst), \
             patch("backend.ai.gemini_client.errors.APIError", FakeAPIError):

            with self.assertRaises(AdvisorGenerationError) as ctx:
                analyze_startup_idea("A valid startup idea for testing purposes.")
            self.assertIn("status 429", str(ctx.exception))

    def test_invalid_json_schema_raises_advisor_generation_error(self) -> None:
        mock_response = MagicMock()
        mock_response.text = '{"idea_score": "invalid_type_not_int"}'

        mock_client_inst = MagicMock()
        mock_client_inst.models.generate_content.return_value = mock_response

        with patch.dict(os.environ, self.valid_env, clear=False), \
             patch("backend.ai.gemini_client.get_gemini_client", return_value=mock_client_inst):

            with self.assertRaises(AdvisorGenerationError) as ctx:
                analyze_startup_idea("A valid startup idea for testing purposes.")
            self.assertIn("did not match the Advisor schema", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
