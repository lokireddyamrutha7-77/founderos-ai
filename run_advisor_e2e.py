import statistics
import time

from backend.ai.gemini_client import analyze_startup_idea
from backend.ai.schemas import AdvisorReport


SAMPLE_IDEAS = [
    {
        "name": "Retail Bookkeeping",
        "idea": (
            "An AI bookkeeping assistant for small retailers "
            "that reads invoices, tracks expenses, and warns owners "
            "about upcoming tax and supplier payments."
        ),
    },
    {
        "name": "Student Rental Marketplace",
        "idea": (
            "A peer-to-peer marketplace where university students "
            "can rent laptops, calculators, cameras, and laboratory "
            "equipment from other verified students."
        ),
    },
    {
        "name": "Telemedicine Platform",
        "idea": (
            "A multilingual mobile platform that helps patients "
            "book telemedicine consultations and receive medicine "
            "reminders through messaging applications."
        ),
    },
    {
        "name": "Factory Energy Monitoring",
        "idea": (
            "A low-cost sensor and analytics platform that helps "
            "small factories monitor electricity waste and receive "
            "recommendations for reducing energy costs."
        ),
    },
    {
        "name": "Creator Education Platform",
        "idea": (
            "A subscription platform that helps independent educators "
            "sell short courses, manage learners, collect payments, "
            "and generate quizzes using artificial intelligence."
        ),
    },
]


def validate_live_report(result: dict) -> AdvisorReport:
    """
    Validate one live Gemini response against the nine-field contract.
    """

    expected_fields = set(AdvisorReport.model_fields)
    returned_fields = set(result)

    if returned_fields != expected_fields:
        missing = expected_fields - returned_fields
        unexpected = returned_fields - expected_fields

        raise ValueError(
            f"Contract mismatch. Missing={missing}, "
            f"Unexpected={unexpected}"
        )

    if len(result) != 9:
        raise ValueError(
            f"Expected 9 fields, received {len(result)}."
        )

    if "id" in result or "created_at" in result:
        raise ValueError(
            "Gemini must not generate id or created_at."
        )

    report = AdvisorReport.model_validate(result)

    legal_text = report.legal_considerations.lower()

    consultation_words = (
        "consult",
        "seek advice",
        "obtain advice",
        "speak with",
    )

    professional_words = (
        "professional",
        "legal counsel",
        "legal advisor",
        "lawyer",
        "attorney",
        "expert",
    )

    has_consultation = any(
        phrase in legal_text
        for phrase in consultation_words
    )

    has_professional = any(
        phrase in legal_text
        for phrase in professional_words
    )

    if not (has_consultation and has_professional):
        raise ValueError(
            "Legal considerations are missing a professional-advice "
            f"disclaimer. Actual output: "
            f"{report.legal_considerations}"
        )

    return report


def main() -> int:
    """
    Run five live Advisor tests and print a summary.
    """

    successful_runs = 0
    failed_runs = 0
    response_times = []

    print()
    print("FOUNDEROS ADVISOR — DAY 3 LIVE TEST")
    print("=" * 60)

    for index, sample in enumerate(SAMPLE_IDEAS, start=1):
        print()
        print(
            f"Test {index}/5 — {sample['name']}"
        )

        started_at = time.perf_counter()

        try:
            result = analyze_startup_idea(
                sample["idea"]
            )

            report = validate_live_report(result)

            elapsed = time.perf_counter() - started_at

            response_times.append(elapsed)
            successful_runs += 1

            print("Status: PASS")
            print(f"Score: {report.idea_score}/100")
            print(f"Fields returned: {len(result)}/9")
            print(
                "Competitors returned: "
                f"{len(report.competitors)}/3"
            )
            print(
                "Growth stages returned: "
                f"{len(report.growth_strategy)}/3"
            )
            print(
                "Next steps returned: "
                f"{len(report.next_steps)}/5"
            )
            print(
                "Legal considerations: "
                f"{report.legal_considerations}"
            )
            print(
                f"Response time: {elapsed:.2f} seconds"
            )

        except Exception as exc:
            elapsed = time.perf_counter() - started_at
            failed_runs += 1

            print("Status: FAIL")
            print(f"Error type: {type(exc).__name__}")
            print(f"Error: {exc}")
            print(
                f"Failed after: {elapsed:.2f} seconds"
            )

        if index < len(SAMPLE_IDEAS):
            print(
                "Waiting 6 seconds before the next API call..."
            )
            time.sleep(6)

    print()
    print("=" * 60)
    print("DAY 3 LIVE TEST SUMMARY")
    print(f"Successful: {successful_runs}/5")
    print(f"Failed: {failed_runs}/5")

    if response_times:
        print(
            "Average response time: "
            f"{statistics.mean(response_times):.2f} seconds"
        )
        print(
            "Slowest response: "
            f"{max(response_times):.2f} seconds"
        )

    if failed_runs == 0:
        print("Final result: PASS")
        return 0

    print("Final result: FAIL")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())