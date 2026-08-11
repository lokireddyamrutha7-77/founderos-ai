"""Offline tests for the FounderOS Gemini Chat client."""

import os
import unittest
from unittest.mock import MagicMock, patch

from backend.ai.chat_client import (
    ChatGenerationError,
    generate_chat_reply,
)
from backend.ai.gemini_client import DEFAULT_MODEL


class FakeAPIError(Exception):
    """Test replacement for the Google SDK APIError."""

    def __init__(self, code: int) -> None:
        super().__init__(f"Fake API error {code}")
        self.code = code


class ChatClientTests(unittest.TestCase):
    def setUp(self) -> None:
        self.valid_environment = {
            "GEMINI_API_KEY": "test-api-key",
            "GEMINI_MODEL": DEFAULT_MODEL,
            "GEMINI_TIMEOUT_MS": "30000",
        }

    @staticmethod
    def create_mock_client(
        response_text: str | None = "Useful founder advice.",
    ) -> tuple[MagicMock, MagicMock]:
        """Create a mocked context-managed Gemini client."""

        client = MagicMock()
        entered_client = MagicMock()

        client.__enter__.return_value = entered_client
        client.__exit__.return_value = False

        response = MagicMock()
        response.text = response_text
        response.candidates = []

        entered_client.models.generate_content.return_value = response

        return client, entered_client

    def test_empty_message_is_rejected_before_api_call(self) -> None:
        with patch(
            "backend.ai.chat_client.genai.Client"
        ) as mocked_client:
            with self.assertRaises(ValueError):
                generate_chat_reply("     ")

        mocked_client.assert_not_called()

    def test_missing_api_key_is_rejected(self) -> None:
        with (
            patch(
                "backend.ai.chat_client.load_dotenv"
            ),
            patch.dict(
                os.environ,
                {"GEMINI_API_KEY": ""},
                clear=False,
            ),
            patch(
                "backend.ai.chat_client.genai.Client"
            ) as mocked_client,
        ):
            with self.assertRaises(ValueError):
                generate_chat_reply("What should I do next?")

        mocked_client.assert_not_called()

    def test_non_integer_timeout_is_rejected(self) -> None:
        environment = {
            **self.valid_environment,
            "GEMINI_TIMEOUT_MS": "invalid",
        }

        with (
            patch(
                "backend.ai.chat_client.load_dotenv"
            ),
            patch.dict(
                os.environ,
                environment,
                clear=False,
            ),
            patch(
                "backend.ai.chat_client.genai.Client"
            ) as mocked_client,
        ):
            with self.assertRaises(ValueError):
                generate_chat_reply("What should I do next?")

        mocked_client.assert_not_called()

    def test_timeout_below_minimum_is_rejected(self) -> None:
        environment = {
            **self.valid_environment,
            "GEMINI_TIMEOUT_MS": "999",
        }

        with (
            patch(
                "backend.ai.chat_client.load_dotenv"
            ),
            patch.dict(
                os.environ,
                environment,
                clear=False,
            ),
            patch(
                "backend.ai.chat_client.genai.Client"
            ) as mocked_client,
        ):
            with self.assertRaises(ValueError):
                generate_chat_reply("What should I do next?")

        mocked_client.assert_not_called()

    def test_successful_reply_is_returned_and_stripped(self) -> None:
        client, entered_client = self.create_mock_client(
            "  Focus on customer interviews first.  "
        )

        with (
            patch(
                "backend.ai.chat_client.load_dotenv"
            ),
            patch.dict(
                os.environ,
                self.valid_environment,
                clear=False,
            ),
            patch(
                "backend.ai.chat_client.genai.Client",
                return_value=client,
            ),
        ):
            reply = generate_chat_reply(
                message="What should I focus on next?",
                memories=[
                    {
                        "title": "Customer research",
                        "content": "Retailers need simpler reporting.",
                    }
                ],
                advisor_report={
                    "idea_score": 68,
                },
            )

        self.assertEqual(
            reply,
            "Focus on customer interviews first.",
        )
        entered_client.models.generate_content.assert_called_once()

    def test_empty_gemini_response_is_rejected(self) -> None:
        client, _ = self.create_mock_client("   ")

        with (
            patch(
                "backend.ai.chat_client.load_dotenv"
            ),
            patch.dict(
                os.environ,
                self.valid_environment,
                clear=False,
            ),
            patch(
                "backend.ai.chat_client.genai.Client",
                return_value=client,
            ),
        ):
            with self.assertRaises(ChatGenerationError):
                generate_chat_reply("What should I do next?")

    def test_gemini_api_error_becomes_chat_generation_error(self) -> None:
        client, entered_client = self.create_mock_client()
        entered_client.models.generate_content.side_effect = FakeAPIError(429)

        with (
            patch(
                "backend.ai.chat_client.load_dotenv"
            ),
            patch.dict(
                os.environ,
                self.valid_environment,
                clear=False,
            ),
            patch(
                "backend.ai.chat_client.genai.Client",
                return_value=client,
            ),
            patch(
                "backend.ai.chat_client.errors.APIError",
                FakeAPIError,
            ),
        ):
            with self.assertRaises(ChatGenerationError) as context:
                generate_chat_reply("What should I do next?")

        self.assertIn(
            "status 429",
            str(context.exception),
        )

    def test_timeout_becomes_chat_generation_error(self) -> None:
        client, entered_client = self.create_mock_client()

        entered_client.models.generate_content.side_effect = TimeoutError(
            "Simulated timeout"
        )

        with (
            patch(
                "backend.ai.chat_client.load_dotenv"
            ),
            patch.dict(
                os.environ,
                self.valid_environment,
                clear=False,
            ),
            patch(
                "backend.ai.chat_client.genai.Client",
                return_value=client,
            ),
        ):
            with self.assertRaises(ChatGenerationError) as context:
                generate_chat_reply("What should I do next?")

        self.assertEqual(
            str(context.exception),
            "Gemini Chat request failed unexpectedly.",
        )

    def test_max_tokens_finish_reason_is_rejected(self) -> None:
        client, entered_client = self.create_mock_client(
            "This is an incomplete reply"
        )

        response = entered_client.models.generate_content.return_value

        candidate = MagicMock()
        candidate.finish_reason = "MAX_TOKENS"
        response.candidates = [candidate]

        with (
            patch(
                "backend.ai.chat_client.load_dotenv"
            ),
            patch.dict(
                os.environ,
                self.valid_environment,
                clear=False,
            ),
            patch(
                "backend.ai.chat_client.genai.Client",
                return_value=client,
            ),
        ):
            with self.assertRaises(ChatGenerationError) as context:
                generate_chat_reply("What should I do next?")

        self.assertIn(
            "truncated",
            str(context.exception).lower(),
        )


if __name__ == "__main__":
    unittest.main()