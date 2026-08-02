# AI Advisor Failure Cases

This document records possible Gemini Advisor failures and how FounderOS handles them.

| Failure case | Detection | Current handling | Next improvement |
|---|---|---|---|
| Missing API key | `GEMINI_API_KEY` is empty | Raise `ValueError` before calling Gemini | Convert to API response contract during integration |
| Invalid or revoked key | Gemini returns HTTP 401 or 403 | Convert Gemini error into `AdvisorGenerationError` | Display a safe configuration message |
| Invalid model | Gemini returns HTTP 404 | Convert Gemini error into `AdvisorGenerationError` | Keep model name configurable through `.env` |
| Rate limit exceeded | Gemini returns HTTP 429 | Return a controlled Gemini API error | Add bounded retry on Day 3 |
| Gemini service failure | Gemini returns HTTP 500–599 | Return a controlled Gemini API error | Add retry and fallback handling on Day 3 |
| Slow response | Request takes too long | Not yet handled | Add request timeout on Day 3 |
| Empty response | `response.text` is empty | Raise `AdvisorGenerationError` | Allow the frontend to retry |
| Malformed JSON | Pydantic cannot parse the response | Reject the response | Structured output reduces this risk |
| Missing required field | Pydantic validation fails | Reject the response | Preserve the locked eight-field contract |
| Unexpected extra field | Pydantic validation fails | Reject the response | Prevent downstream contract changes |
| Incorrect field type | Pydantic validation fails | Reject the response | Log validation details during development |
| Weak startup description | Input is shorter than 10 characters | Reject before calling Gemini | Frontend should request more detail |
| Excessive startup description | Input exceeds 5,000 characters | Reject before calling Gemini | Frontend should show a character counter |
| Hallucinated market facts | Unsupported claims appear in analysis | Prompt tells Gemini not to invent evidence | Add grounded sources in a later phase |

## Day 2 Decision

FounderOS uses Gemini structured output with a Pydantic JSON schema.

The Advisor response is accepted only when:

- All eight required fields are present.
- All values have the correct type.
- The score is between 0 and 100.
- Competitor, SWOT, growth, revenue, and next-step counts are correct.
- No unexpected fields are present.

Retry, timeout, and fallback behaviour will be implemented on Day 3.