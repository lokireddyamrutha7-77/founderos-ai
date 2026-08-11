"""Offline unit tests for Day 11 conversation stress testing and context isolation."""

import unittest

from backend.ai.chat_prompts import (
    _prepare_memory_context,
    get_chat_prompt,
)


class ChatStressAndIsolationTests(unittest.TestCase):

    def test_context_isolation_between_users(self) -> None:
        user_a_memories = [
            {"title": "User A Startup", "content": "Building a B2B SaaS for accountants."}
        ]
        user_b_memories = [
            {"title": "User B Startup", "content": "Building a D2C shoe brand."}
        ]

        prompt_a = get_chat_prompt("What is my goal?", memories=user_a_memories)
        prompt_b = get_chat_prompt("What is my goal?", memories=user_b_memories)

        self.assertIn("B2B SaaS for accountants", prompt_a)
        self.assertNotIn("D2C shoe brand", prompt_a)

        self.assertIn("D2C shoe brand", prompt_b)
        self.assertNotIn("B2B SaaS for accountants", prompt_b)

    def test_first_time_user_empty_context_behavior(self) -> None:
        prompt = get_chat_prompt(
            message="Hello, I just signed up. How does FounderOS work?",
            memories=[],
            advisor_report=None,
        )

        self.assertIn("If Memory context is empty, do not claim to remember anything.", prompt)
        self.assertIn("If Advisor context is empty, do not claim that an Advisor analysis exists.", prompt)
        self.assertIn("<MEMORY_CONTEXT>\n[]\n</MEMORY_CONTEXT>", prompt)
        self.assertIn("<ADVISOR_CONTEXT>\n{}\n</ADVISOR_CONTEXT>", prompt)

    def test_memory_trimming_under_high_count(self) -> None:
        memories = [
            {"title": f"Memory {i}", "content": f"Content for memory {i}"}
            for i in range(1, 20)
        ]

        prepared = _prepare_memory_context(memories)

        self.assertEqual(len(prepared), 5)
        self.assertEqual(prepared[0]["title"], "Memory 1")
        self.assertEqual(prepared[4]["title"], "Memory 5")

    def test_multi_turn_prompt_construction(self) -> None:
        prompt1 = get_chat_prompt("First question about pricing?")
        prompt2 = get_chat_prompt("Follow-up question about customer acquisition?")

        self.assertIn("First question about pricing?", prompt1)
        self.assertIn("Follow-up question about customer acquisition?", prompt2)


if __name__ == "__main__":
    unittest.main()
