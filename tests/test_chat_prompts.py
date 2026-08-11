"""Offline tests for the FounderOS Chat prompt builder."""

import unittest

from backend.ai.chat_prompts import (
    CHAT_SYSTEM_PROMPT,
    get_chat_prompt,
)


class ChatPromptTests(unittest.TestCase):
    def test_valid_message_builds_prompt(self) -> None:
        prompt = get_chat_prompt(
            "What should I focus on next?",
        )

        self.assertIsInstance(prompt, str)
        self.assertIn("What should I focus on next?", prompt)
        self.assertIn("<MEMORY_CONTEXT>", prompt)
        self.assertIn("<ADVISOR_CONTEXT>", prompt)
        self.assertIn("<FOUNDER_MESSAGE>", prompt)

    def test_whitespace_message_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            get_chat_prompt("     ")

    def test_non_string_message_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            get_chat_prompt(123)  # type: ignore[arg-type]

    def test_message_over_5000_characters_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            get_chat_prompt("A" * 5001)

    def test_invalid_memory_collection_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            get_chat_prompt(
                "Help me prioritize.",
                memories="invalid",  # type: ignore[arg-type]
            )

    def test_invalid_memory_item_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            get_chat_prompt(
                "Help me prioritize.",
                memories=["invalid"],  # type: ignore[list-item]
            )

    def test_memory_title_and_content_are_included(self) -> None:
        prompt = get_chat_prompt(
            "What do you remember?",
            memories=[
                {
                    "title": "Customer interviews",
                    "content": "Retailers struggle with weekly inventory counts.",
                }
            ],
        )

        self.assertIn("Customer interviews", prompt)
        self.assertIn(
            "Retailers struggle with weekly inventory counts.",
            prompt,
        )

    def test_category_is_used_when_title_is_missing(self) -> None:
        prompt = get_chat_prompt(
            "What do you remember?",
            memories=[
                {
                    "category": "market research",
                    "content": "Three founders requested simpler reporting.",
                }
            ],
        )

        self.assertIn("market research", prompt)
        self.assertIn(
            "Three founders requested simpler reporting.",
            prompt,
        )

    def test_only_five_memories_are_added(self) -> None:
        memories = [
            {
                "title": f"Memory {index}",
                "content": f"Content {index}",
            }
            for index in range(1, 7)
        ]

        prompt = get_chat_prompt(
            "Summarize my memories.",
            memories=memories,
        )

        self.assertIn("Memory 1", prompt)
        self.assertIn("Memory 5", prompt)
        self.assertNotIn("Memory 6", prompt)

    def test_empty_memory_content_is_skipped(self) -> None:
        prompt = get_chat_prompt(
            "What do you remember?",
            memories=[
                {
                    "title": "Empty memory",
                    "content": "   ",
                }
            ],
        )

        self.assertNotIn("Empty memory", prompt)

    def test_advisor_context_is_included(self) -> None:
        prompt = get_chat_prompt(
            "How strong is my idea?",
            advisor_report={
                "idea_score": 68,
                "market_validation": "Validate willingness to pay.",
            },
        )

        self.assertIn('"idea_score": 68', prompt)
        self.assertIn("Validate willingness to pay.", prompt)

    def test_invalid_advisor_context_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            get_chat_prompt(
                "How strong is my idea?",
                advisor_report="invalid",  # type: ignore[arg-type]
            )

    def test_system_prompt_contains_context_safety_rules(self) -> None:
        lower_prompt = CHAT_SYSTEM_PROMPT.lower()

        self.assertIn("untrusted data", lower_prompt)
        self.assertIn("never invent", lower_prompt)
        self.assertIn("plain text only", lower_prompt)


if __name__ == "__main__":
    unittest.main()