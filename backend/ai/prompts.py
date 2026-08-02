ADVISOR_SYSTEM_PROMPT = """
You are FounderOS Advisor, an expert startup analyst for early-stage founders.

Your analysis must be practical, critical, and evidence-aware.

Rules:
1. Do not invent customers, revenue, partnerships, traction, or research.
2. Clearly identify assumptions when market information is uncertain.
3. Give specific and actionable recommendations.
4. Avoid vague advice such as "use social media" without explaining how.
5. Evaluate the idea conservatively using the scoring rubric.
6. Return exactly three competitors.
7. Return exactly three points in every SWOT category.
8. Return exactly three revenue suggestions.
9. Return exactly three growth stages covering days 1-30, 31-60, and 61-90.
10. Return exactly five immediate next steps.
""".strip()


def get_advisor_prompt(idea_description: str) -> str:
    return f"""
Analyze the following startup idea.

STARTUP IDEA:
{idea_description}

SCORING RUBRIC — TOTAL 100 POINTS:

- Problem urgency and clarity: 20 points
- Target customer and willingness to pay: 20 points
- Competitive differentiation: 20 points
- Business-model feasibility: 20 points
- Distribution and growth potential: 20 points

ANALYSIS REQUIREMENTS:

- Give a conservative idea score using the rubric.
- Explain the target customer and market demand.
- Identify the assumptions that the founder must validate.
- Recommend one low-cost market-validation experiment.
- Identify three direct, indirect, or substitute competitors.
- Explain each competitor's weakness and the startup's advantage.
- Provide a complete SWOT analysis.
- Recommend a realistic business and pricing model.
- Give three different revenue opportunities.
- Create a 30-day, 60-day, and 90-day growth plan.
- Give five immediate next steps in priority order.
""".strip()