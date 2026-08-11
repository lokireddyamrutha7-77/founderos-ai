import os

from dotenv import load_dotenv
from google import genai
from google.genai import errors, types
from pydantic import ValidationError

from .prompts import (
    ADVISOR_SYSTEM_PROMPT,
    get_advisor_prompt,
)
from .schemas import AdvisorReport


load_dotenv()

DEFAULT_MODEL = "gemini-3.5-flash"


class AdvisorGenerationError(RuntimeError):
    """
    Controlled error raised when Gemini cannot produce
    a valid Advisor report.
    """


def get_gemini_client() -> genai.Client:
    """
    Create the Gemini client using the API key from .env.
    """

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is missing. "
            "Add it to your local .env file."
        )

    return genai.Client(api_key=api_key)


def analyze_startup_idea(
    idea_description: str,
) -> dict:
    """
    Generate and validate a nine-field startup analysis.
    """

    cleaned_idea = idea_description.strip()

    if len(cleaned_idea) < 10:
        raise ValueError(
            "Startup idea must contain at least 10 characters."
        )

    if len(cleaned_idea) > 5000:
        raise ValueError(
            "Startup idea must contain at most 5,000 characters."
        )

    client = get_gemini_client()
    prompt = get_advisor_prompt(cleaned_idea)

    model_name = os.getenv(
        "GEMINI_MODEL",
        DEFAULT_MODEL,
    )

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=ADVISOR_SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_json_schema=(
                    AdvisorReport.model_json_schema()
                ),
            ),
        )

        if not response.text:
            raise AdvisorGenerationError(
                "Gemini returned an empty response."
            )

        report = AdvisorReport.model_validate_json(
            response.text
        )

        return report.model_dump(mode="json")

    except errors.APIError as exc:
        status_code = getattr(
            exc,
            "code",
            "unknown",
        )

        raise AdvisorGenerationError(
            "Gemini API request failed "
            f"with status {status_code}."
        ) from exc

    except ValidationError as exc:
        raise AdvisorGenerationError(
            "Gemini response did not match "
            "the Advisor schema."
        ) from exc