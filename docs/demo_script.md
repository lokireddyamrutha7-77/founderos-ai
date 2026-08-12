# Altora — Demo Script &amp; Presentation Draft

Working draft. Refine this closer to Day 16-19 once every module is actually
built, but the skeleton and talking points can be locked in now.

## Structure (aim for 4-6 minutes total, adjust to actual slot)

### 1. Opening hook (20-30 sec)
"Founders today use ChatGPT, Notion, a spreadsheet, and a project tracker —
four different tools that don't talk to each other. Every time you open a new
ChatGPT conversation, it's forgotten everything about your business. Altora is
different: it's one connected workspace that actually remembers you."

### 2. The problem, fast (20-30 sec)
- Fragmented tools, no shared context
- General AI assistants reset every session
- No single place that tracks an idea becoming a real business over time

### 3. Live demo — the golden path (2.5-3 min)
Walk this exact sequence, out loud, narrating what's happening and why it
matters at each step:

1. **Landing page** — "This is Altora." (2-3 seconds, don't over-narrate design)
2. **Login** → **Workspace** — "This is the founder's home base."
3. **Enter a startup idea** into Advisor — say the idea out loud as you type it
4. **Advisor generates the structured report** — call out 2-3 specific fields
   live (idea score, one SWOT point, one next step) so judges see it's real
   output, not a canned screenshot
5. **Save to Memory** — "This isn't just an answer we'll forget — it's saved."
6. **Open Chat, ask a follow-up** that only makes sense if the AI remembers
   the idea (e.g. "what should I focus on first?") — let it respond, then
   point out: "I didn't re-explain my idea. It already knew."
7. **Back to Workspace/Dashboard** — show it reflecting the saved data

### 4. What makes this different (30-40 sec)
"This isn't the first tool to validate an idea — plenty of AI products already
do that well. What's different is that Altora remembers, structures, and
builds on your business every time you come back, instead of resetting with
every new conversation."

(If time allows, briefly show Finance snapshot or one bonus module - Inventory
/ Business Timeline / PDF export - as evidence of depth beyond the core loop.)

### 5. Tech &amp; honesty note (15-20 sec, only if asked or time allows)
- Built on Gemini, FastAPI, React
- Location and legal guidance are clearly framed as general strategic
  guidance, not verified real-time data or legal advice — deliberate,
  responsible design choice, not an oversight

### 6. Close (10-15 sec)
"Altora — build companies that deserve to exist. Thank you."

---

## Anticipated judge questions — prepared answers

**"How is this different from just using ChatGPT?"**
&gt; ChatGPT is stateless — every new chat starts from zero. Altora's Memory
&gt; module keeps a structured, searchable record of a founder's business, and
&gt; Chat automatically pulls that context in, so the founder never re-explains
&gt; themselves. That's an architectural difference, not just a UI difference.

**"Isn't this similar to [IdeaProof / Jenova / other tool]?"**
&gt; Yes, and we looked at those directly. Most idea-validation tools generate a
&gt; one-time report and stop there. Altora's differentiation is the persistent,
&gt; connected loop — memory, advisor, and chat all sharing the same context over
&gt; time, not a single report you download and forget.

**"How accurate is the location/market guidance?"**
&gt; It's intentionally general and strategic, not claiming real-time market
&gt; data. We say so directly in the product. A grounded, search-augmented
&gt; version is a clear next step we've scoped but didn't build for this
&gt; timeline.

**"What was the hardest technical part?"**
&gt; Getting Gemini to reliably return structured, consistent JSON across many
&gt; different kinds of startup ideas, and making sure every team member's
&gt; endpoints followed one shared response contract so five people's code could
&gt; integrate cleanly.

**"What would you build next?"**
&gt; Search-grounded Advisor responses, semantic memory search instead of
&gt; keyword-only, real accounting integrations for Finance, and multi-founder
&gt; team workspaces.

---

## Logistics checklist (fill in closer to the day)

- [ ] Who is speaking which section?
- [ ] Backup plan if live Gemini call is slow/fails during demo (cached example ready?)
- [ ] Backup plan if wifi/deployment has issues (local version ready as fallback?)
- [ ] Confirm exact time limit for the slot
- [ ] Rehearse with a timer at least twice before Day 19

---

## Technical Defense Quick-Sheet (Person 2 AI Architecture)

1. **Why Structured Output over Freeform Markdown?**
   - Enables direct schema validation via Pydantic (`AdvisorReport`).
   - Guarantees predictable key names so Person 3's UI and Person 5's PDF exporter can render fields programmatically without regex string parsing.

2. **Why Exactly 9 Fields?**
   - Standardized evaluation scope: `idea_score`, `market_validation`, `competitors` (x3), `swot` (3x4), `business_model`, `revenue_suggestions` (x3), `growth_strategy` (x3), `legal_considerations`, `next_steps` (x5).
   - Prevents missing fields or extra hallucinated fields.

3. **How Does Fallback Protection Guarantee Demo Reliability?**
   - If Gemini API times out (30s limit), returns 5xx/429 status, or emits empty text, `analyze_startup_idea()` catches `AdvisorGenerationError` and cleanly serves `get_demo_fallback_report()` which is schema-validated against the exact same 9-field contract.

4. **How Are Prompt Injection & Cross-User Memory Leakage Prevented?**
   - All user inputs, saved memories, and prior Advisor reports are enclosed within strict XML context tags (`<MEMORY_CONTEXT>`, `<ADVISOR_CONTEXT>`, `<FOUNDER_MESSAGE>`) and instructed to be treated as untrusted data.
   - Memory context retrieval in `/chat` is hard-filtered by `current_user.id` (`user_id=current_user.id`), preventing multi-tenant memory leakage.