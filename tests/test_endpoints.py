"""Offline unit tests for FastAPI endpoints: POST /advisor/analyze and POST /chat."""

import os
import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

backend_path = Path(__file__).resolve().parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from fastapi.testclient import TestClient

try:
    from main import app
except ImportError:
    from backend.main import app

try:
    from services.security import get_current_user
except ImportError:
    from backend.services.security import get_current_user

try:
    import api.advisor as advisor_module
    import api.chat as chat_module
except ImportError:
    import backend.api.advisor as advisor_module
    import backend.api.chat as chat_module

from models.user import User


def get_mock_user() -> User:
    user = User()
    user.id = 1
    user.email = "test@example.com"
    user.hashed_password = "hashedpassword"
    return user


class EndpointTests(unittest.TestCase):

    def setUp(self) -> None:
        self.client = TestClient(app)
        app.dependency_overrides.clear()

    def tearDown(self) -> None:
        app.dependency_overrides.clear()

    def test_advisor_requires_auth(self) -> None:
        response = self.client.post("/advisor/analyze", json={"idea_description": "Valid startup idea for testing."})
        self.assertEqual(response.status_code, 401)

    def test_advisor_short_input_validation(self) -> None:
        app.dependency_overrides[get_current_user] = get_mock_user
        response = self.client.post("/advisor/analyze", json={"idea_description": "Short"})
        self.assertEqual(response.status_code, 422)
        res_json = response.json()
        self.assertFalse(res_json["success"])
        self.assertIsNotNone(res_json["error"])

    def test_advisor_successful_analysis(self) -> None:
        mock_report = {
            "idea_score": 80,
            "market_validation": "Good demand",
            "competitors": [
                {"name": "A", "weakness": "W1", "advantage": "Adv1"},
                {"name": "B", "weakness": "W2", "advantage": "Adv2"},
                {"name": "C", "weakness": "W3", "advantage": "Adv3"},
            ],
            "swot": {
                "strengths": ["S1", "S2", "S3"],
                "weaknesses": ["W1", "W2", "W3"],
                "opportunities": ["O1", "O2", "O3"],
                "threats": ["T1", "T2", "T3"],
            },
            "business_model": "SaaS",
            "revenue_suggestions": ["R1", "R2", "R3"],
            "growth_strategy": ["Stage 1", "Stage 2", "Stage 3"],
            "legal_considerations": "Consult a licensed professional in your area.",
            "next_steps": ["N1", "N2", "N3", "N4", "N5"],
        }

        app.dependency_overrides[get_current_user] = get_mock_user
        with patch.object(advisor_module, "analyze_startup_idea", return_value=mock_report):
            response = self.client.post("/advisor/analyze", json={"idea_description": "A valid subscription business idea for restaurants."})

        self.assertEqual(response.status_code, 200)
        res_json = response.json()
        self.assertTrue(res_json["success"])
        self.assertIsNone(res_json["error"])
        self.assertEqual(res_json["data"]["idea_score"], 80)
        self.assertEqual(len(res_json["data"]), 9)

    def test_chat_requires_auth(self) -> None:
        response = self.client.post("/chat", json={"message": "What should I do next?"})
        self.assertEqual(response.status_code, 401)

    def test_chat_empty_message_validation(self) -> None:
        app.dependency_overrides[get_current_user] = get_mock_user
        response = self.client.post("/chat", json={"message": ""})
        self.assertEqual(response.status_code, 422)
        res_json = response.json()
        self.assertFalse(res_json["success"])

    def test_chat_successful_response_with_no_context(self) -> None:
        app.dependency_overrides[get_current_user] = get_mock_user
        with patch.object(chat_module, "get_memories_for_chat_context", return_value=[]), \
             patch.object(chat_module, "generate_chat_reply", return_value="Focus on customer validation."):

            response = self.client.post("/chat", json={"message": "What should I focus on next?"})

        self.assertEqual(response.status_code, 200)
        res_json = response.json()
        self.assertTrue(res_json["success"])
        self.assertIsNone(res_json["error"])
        self.assertEqual(res_json["data"]["reply"], "Focus on customer validation.")
        self.assertEqual(res_json["data"]["used_memory_ids"], [])
        self.assertIsNone(res_json["data"]["used_advisor_report_id"])

    def test_chat_safe_failure_response(self) -> None:
        try:
            from ai.chat_client import ChatGenerationError
        except ImportError:
            from backend.ai.chat_client import ChatGenerationError

        app.dependency_overrides[get_current_user] = get_mock_user
        with patch.object(chat_module, "get_memories_for_chat_context", return_value=[]), \
             patch.object(chat_module, "generate_chat_reply", side_effect=ChatGenerationError("Gemini error")):

            response = self.client.post("/chat", json={"message": "What should I focus on next?"})

        self.assertEqual(response.status_code, 200)
        res_json = response.json()
        self.assertFalse(res_json["success"])
        self.assertIsNone(res_json["data"])
        self.assertEqual(res_json["error"], "Chat is temporarily unavailable. Please try again.")


if __name__ == "__main__":
    unittest.main()
