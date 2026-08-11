# Advisor Day 4 Stress-Test Results

## Result

The FounderOS Advisor passed all six Day 4 stress tests.

- Successful tests: 6/6
- Failed tests: 0/6
- Final result: PASS

## Test Results

| Test case | Expected behaviour | Result | Response time |
|---|---|---|---|
| Whitespace-only input | Reject locally | PASS | 0.000 seconds |
| Very short input | Reject locally | PASS | 0.000 seconds |
| Input over 5,000 characters | Reject locally | PASS | 0.000 seconds |
| Vague startup idea | Return a conservative nine-field report | PASS — 15/100 | 20.67 seconds |
| Gibberish input | Return a controlled response without crashing | PASS — 15/100 | 18.90 seconds |
| Normal startup idea | Return a valid nine-field report | PASS — 57/100 | 20.12 seconds |

## Contract Verification

Every generated response contained exactly these nine fields:

1. `idea_score`
2. `market_validation`
3. `competitors`
4. `swot`
5. `business_model`
6. `revenue_suggestions`
7. `growth_strategy`
8. `legal_considerations`
9. `next_steps`

## Findings

- Invalid input length is rejected before Gemini is called.
- Whitespace-only and very short ideas are rejected safely.
- Ideas longer than 5,000 characters are rejected safely.
- Vague and gibberish input does not crash the application.
- Gemini scores vague and gibberish input conservatively.
- The locked nine-field response contract remains stable.
- Average live response time was approximately 19.90 seconds.
- The slowest live response was 20.67 seconds.

## Future Improvement

Gibberish input currently produces a low-scoring structured report instead of being rejected before the Gemini call. A later improvement could add semantic input validation. This is not a current blocker because the response is controlled, conservative, and contract-valid.