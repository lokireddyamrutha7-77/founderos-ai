"""Controlled live Gemini test for FounderOS Chat."""

from __future__ import annotations

import time

from backend.ai.chat_client import (
    ChatGenerationError,
    generate_chat_reply,
)


SAMPLE_MEMORIES = [
    {
        "title": "Customer interviews",
        "content": (
            "Small retailers said weekly inventory counting takes too long."
        ),
    },
    {
        "title": "Product decision",
        "content": (
            "The first version should focus on inventory alerts rather than "
            "advanced financial forecasting."
        ),
    },
]


SAMPLE_ADVISOR_REPORT = {
    "idea_score": 68,
    "market_validation": (
        "Validate whether independent retailers will pay for automated "
        "inventory alerts."
    ),
    "growth_strategy": [
        "Interview retailers during days 1-30.",
        "Run a small pilot during days 31-60.",
        "Convert successful pilots during days 61-90.",
    ],
    "next_steps": [
        "Interview 15 independent retailers.",
        "Measure time spent counting inventory.",
        "Create a manual inventory-alert prototype.",
        "Test willingness to pay.",
        "Run a small paid pilot.",
    ],
}


def main() -> int:
    """Run one live Chat generation request."""

    print("=" * 60)
    print("FOUNDEROS CHAT — LIVE CONTEXT TEST")
    print("=" * 60)

    message = (
        "Based on what you remember and my Advisor report, "
        "what are the three most important things I should do next?"
    )

    started_at = time.perf_counter()

    try:
        reply = generate_chat_reply(
            message=message,
            memories=SAMPLE_MEMORIES,
            advisor_report=SAMPLE_ADVISOR_REPORT,
        )
    except (ValueError, ChatGenerationError) as error:
        elapsed = time.perf_counter() - started_at

        print("Status: FAIL")
        print(f"Error type: {type(error).__name__}")
        print(f"Error: {error}")
        print(f"Response time: {elapsed:.2f} seconds")
        return 1
    except Exception as error:
        elapsed = time.perf_counter() - started_at

        print("Status: FAIL")
        print(f"Unexpected error: {type(error).__name__}: {error}")
        print(f"Response time: {elapsed:.2f} seconds")
        return 1

    elapsed = time.perf_counter() - started_at

    if not reply.strip():
        print("Status: FAIL")
        print("Gemini returned an empty reply.")
        return 1

    print("Status: PASS")
    print(f"Response time: {elapsed:.2f} seconds")
    print("\nReply:")
    print(reply)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())