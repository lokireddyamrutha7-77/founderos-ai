# Chat Context Contract — Draft (Person 4 → Person 2, please review/adjust)

## Goal
Chat needs to feel like it "remembers" — meaning every message sent to Gemini
should include relevant Memory entries and past Advisor reports as context, not
just the current message alone.

## Proposed request shape (frontend -> POST /chat)
```json
{
  "message": "What should I focus on next for my idea?"
}
```
(No need to send memory/context from frontend — backend fetches it.)

## Proposed flow inside POST /chat (backend)
1. Receive user's message
2. Call `retrieve_relevant_memories(db, keyword=<extracted from message or just recent>)`
   — this endpoint already exists and works: `GET /memory/retrieve?keyword=...`
3. Fetch the user's most recent `advisor_reports` entry (if any)
4. Build a Gemini prompt that includes:
   - The user's message
   - A short summary of relevant memories (title + content, keep it brief)
   - Key fields from the latest Advisor report (idea_score, growth_strategy, next_steps)
5. Send to Gemini, get response
6. Save both the user message and assistant response to `chat_messages`
7. Return in the standard contract:
```json
{
  "success": true,
  "data": {
    "reply": "Based on your idea's validation score of 8/10, I'd focus on...",
    "used_memory_ids": [4, 7],
    "used_advisor_report_id": 12
  },
  "error": null
}
```

## Open questions for P2
- Should memory retrieval use the current message as the search keyword, or
  always pull the N most recent + most important memories regardless of message
  content? (Simpler for a demo: always pull recent + important, skip keyword
  matching for now — more reliable for the live demo.)
- Do you want me to build the "fetch relevant memory for chat" helper function
  in `memory_service.py`, or will you call the existing `/memory/retrieve`
  endpoint directly from your chat service?

Let's sync briefly once you're ready to start Chat — this doesn't need to be
finalized today, just want it on your radar before Days 4-7.
