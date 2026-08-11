"""Day 4 stress tests for the FounderOS Gemini Advisor."""

from __future__ import annotations

import time

from backend.ai.gemini_client import (
    AdvisorGenerationError,
    analyze_startup_idea,
)


REQUIRED_FIELDS = {
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


def validate_report(report: dict) -> None:
    """Confirm that Gemini returned the locked nine-field contract."""

    if not isinstance(report, dict):
        raise ValueError("Advisor response is not a dictionary.")

    returned_fields = set(report.keys())

    if returned_fields != REQUIRED_FIELDS:
        missing = REQUIRED_FIELDS - returned_fields
        extra = returned_fields - REQUIRED_FIELDS

        raise ValueError(
            f"Incorrect fields. Missing: {sorted(missing)}; "
            f"Extra: {sorted(extra)}"
        )

    if len(report["competitors"]) != 3:
        raise ValueError("Advisor did not return exactly three competitors.")

    if len(report["revenue_suggestions"]) != 3:
        raise ValueError(
            "Advisor did not return exactly three revenue suggestions."
        )

    if len(report["growth_strategy"]) != 3:
        raise ValueError(
            "Advisor did not return exactly three growth stages."
        )

    if len(report["next_steps"]) != 5:
        raise ValueError("Advisor did not return exactly five next steps.")


def test_expected_rejection(
    test_number: int,
    name: str,
    idea_description: str,
) -> bool:
    """Confirm invalid input is rejected before a usable report is returned."""

    print(f"\nTest {test_number} — {name}")

    started_at = time.perf_counter()

    try:
        analyze_startup_idea(idea_description)
    except ValueError as error:
        elapsed = time.perf_counter() - started_at
        print("Status: PASS")
        print(f"Controlled rejection: {error}")
        print(f"Response time: {elapsed:.3f} seconds")
        return True
    except AdvisorGenerationError as error:
        elapsed = time.perf_counter() - started_at
        print("Status: FAIL")
        print("Input reached the Gemini generation stage unexpectedly.")
        print(f"Error: {error}")
        print(f"Response time: {elapsed:.3f} seconds")
        return False
    except Exception as error:
        elapsed = time.perf_counter() - started_at
        print("Status: FAIL")
        print(f"Unexpected error type: {type(error).__name__}")
        print(f"Error: {error}")
        print(f"Response time: {elapsed:.3f} seconds")
        return False

    elapsed = time.perf_counter() - started_at
    print("Status: FAIL")
    print("Invalid input was accepted instead of being rejected.")
    print(f"Response time: {elapsed:.3f} seconds")
    return False


def test_live_input(
    test_number: int,
    name: str,
    idea_description: str,
    allow_controlled_rejection: bool = False,
) -> bool:
    """Test a valid-length input against the live Gemini pipeline."""

    print(f"\nTest {test_number} — {name}")

    started_at = time.perf_counter()

    try:
        report = analyze_startup_idea(idea_description)
        validate_report(report)
    except (ValueError, AdvisorGenerationError) as error:
        elapsed = time.perf_counter() - started_at

        if allow_controlled_rejection:
            print("Status: PASS")
            print("The unusual input was rejected safely.")
            print(f"Controlled error: {error}")
            print(f"Response time: {elapsed:.2f} seconds")
            return True

        print("Status: FAIL")
        print(f"Controlled error: {error}")
        print(f"Response time: {elapsed:.2f} seconds")
        return False
    except Exception as error:
        elapsed = time.perf_counter() - started_at
        print("Status: FAIL")
        print(f"Unexpected crash: {type(error).__name__}: {error}")
        print(f"Response time: {elapsed:.2f} seconds")
        return False

    elapsed = time.perf_counter() - started_at

    print("Status: PASS")
    print(f"Score: {report['idea_score']}/100")
    print(f"Fields returned: {len(report)}/9")
    print(f"Response time: {elapsed:.2f} seconds")
    return True


def main() -> int:
    """Run the complete Day 4 Advisor stress test."""

    print("=" * 60)
    print("FOUNDEROS ADVISOR — DAY 4 STRESS TEST")
    print("=" * 60)

    results: list[bool] = []

    # These inputs must be rejected locally without calling Gemini.
    results.append(
        test_expected_rejection(
            1,
            "Whitespace-only input",
            "     ",
        )
    )

    results.append(
        test_expected_rejection(
            2,
            "Very short idea",
            "AI app",
        )
    )

    results.append(
        test_expected_rejection(
            3,
            "Very long idea",
            "A" * 5001,
        )
    )

    # These cases may call Gemini.
    results.append(
        test_live_input(
            4,
            "Vague idea",
            "I want to build an app that helps people solve everyday problems.",
        )
    )

    print("\nWaiting 6 seconds before the next API call...")
    time.sleep(6)

    results.append(
        test_live_input(
            5,
            "Gibberish input",
            "florbnex quibble zorp startup wobble market thing platform",
            allow_controlled_rejection=True,
        )
    )

    print("\nWaiting 6 seconds before the next API call...")
    time.sleep(6)

    results.append(
        test_live_input(
            6,
            "Normal startup idea",
            (
                "A subscription platform that helps independent restaurants "
                "predict ingredient demand and reduce food waste."
            ),
        )
    )

    passed = sum(results)
    failed = len(results) - passed

    print("\n" + "=" * 60)
    print("DAY 4 STRESS TEST SUMMARY")
    print(f"Successful: {passed}/{len(results)}")
    print(f"Failed: {failed}/{len(results)}")
    print(f"Final result: {'PASS' if failed == 0 else 'FAIL'}")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())