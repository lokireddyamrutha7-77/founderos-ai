import unittest

from backend.ai.fallback import (
    DEMO_FALLBACK_IDEA,
    get_demo_fallback_report,
)
from backend.ai.schemas import AdvisorReport


class AdvisorFallbackTests(unittest.TestCase):

    def test_fallback_matches_advisor_schema(self):
        fallback = get_demo_fallback_report()

        validated = AdvisorReport.model_validate(fallback)

        self.assertEqual(
            validated.idea_score,
            68,
        )

    def test_fallback_contains_exactly_nine_fields(self):
        fallback = get_demo_fallback_report()

        self.assertEqual(
            set(fallback),
            set(AdvisorReport.model_fields),
        )

        self.assertEqual(
            len(fallback),
            9,
        )

    def test_fallback_contains_legal_disclaimer(self):
        fallback = get_demo_fallback_report()

        legal_text = fallback[
            "legal_considerations"
        ].lower()

        self.assertIn(
            "licensed professional",
            legal_text,
        )

    def test_fallback_has_a_known_demo_idea(self):
        self.assertGreaterEqual(
            len(DEMO_FALLBACK_IDEA),
            10,
        )


if __name__ == "__main__":
    unittest.main()