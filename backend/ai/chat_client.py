"""Gemini generation service for FounderOS Chat."""

from __future__ import annotations

import os
from typing import Any

from dotenv import load_dotenv
from google import genai
from google.genai import errors, types

from .chat_prompts import CHAT_SYSTEM_PROMPT, get_chat_prompt
from .gemini_client import DEFAULT_MODEL


DEFAULT_TIMEOUT_MS = 30_000
DEFAULT_MAX_OUTPUT_TOKENS = 1_600


class ChatGenerationError(RuntimeError):
    """Raised when Gemini cannot generate a usable Chat reply."""


def _get_timeout_ms() -> int:
    """Read and validate the configurable Gemini timeout."""

    raw_timeout = os.getenv(
        "GEMINI_TIMEOUT_MS",
        str(DEFAULT_TIMEOUT_MS),
    )

    try:
        timeout_ms = int(raw_timeout)
    except ValueError as exc:
        raise ValueError(
            "GEMINI_TIMEOUT_MS must be an integer."
        ) from exc

    if timeout_ms < 1_000:
        raise ValueError(
            "GEMINI_TIMEOUT_MS must be at least 1,000 milliseconds."
        )

    return timeout_ms


def _get_generation_config(
    model_name: str,
) -> types.GenerateContentConfig:
    """Build model-compatible Chat generation settings."""

    config_values: dict[str, Any] = {
        "system_instruction": CHAT_SYSTEM_PROMPT,
        "temperature": 0.4,
        "max_output_tokens": DEFAULT_MAX_OUTPUT_TOKENS,
    }

    normalized_model = model_name.lower()

    if normalized_model.startswith("gemini-3"):
        config_values["thinking_config"] = types.ThinkingConfig(
            thinking_level=types.ThinkingLevel.MINIMAL,
        )
    elif normalized_model.startswith("gemini-2.5"):
        config_values["thinking_config"] = types.ThinkingConfig(
            thinking_budget=0,
        )

    return types.GenerateContentConfig(**config_values)


def _response_was_truncated(response: Any) -> bool:
    """Detect a Gemini response stopped because it reached its token limit."""

    candidates = getattr(response, "candidates", None)

    if not candidates:
        return False

    finish_reason = getattr(
        candidates[0],
        "finish_reason",
        None,
    )

    if finish_reason is None:
        return False

    return "MAX_TOKENS" in str(finish_reason).upper()


def generate_chat_reply(
    message: str,
    memories: list[dict[str, Any]] | None = None,
    advisor_report: dict[str, Any] | None = None,
) -> str:
    """
    Generate a plain-text Chat reply using optional application context.

    This service does not authenticate users, query the database, save chat
    messages, or construct the HTTP response envelope.
    """

    prompt = get_chat_prompt(
        message=message,
        memories=memories,
        advisor_report=advisor_report,
    )

    load_dotenv()

    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured.")

    model_name = os.getenv(
        "GEMINI_MODEL",
        DEFAULT_MODEL,
    ).strip()

    if not model_name:
        raise ValueError("GEMINI_MODEL must not be empty.")

    timeout_ms = _get_timeout_ms()
    generation_config = _get_generation_config(model_name)

    try:
        with genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(
                timeout=timeout_ms,
            ),
        ) as client:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=generation_config,
            )

        if _response_was_truncated(response):
            raise ChatGenerationError(
                "Gemini Chat response was truncated."
            )

        reply = (response.text or "").strip()

        if not reply:
            raise ChatGenerationError(
                "Gemini returned an empty Chat response."
            )

        return reply

    except ChatGenerationError:
        raise

    except errors.APIError as exc:
        status_code = getattr(
            exc,
            "code",
            "unknown",
        )

        raise ChatGenerationError(
            "Gemini Chat request failed "
            f"with status {status_code}."
        ) from exc

    except Exception as exc:
        raise ChatGenerationError(
            "Gemini Chat request failed unexpectedly."
        ) from exc