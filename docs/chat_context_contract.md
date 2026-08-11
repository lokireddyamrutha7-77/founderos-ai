# Chat Context Contract — Finalized (Person 4 → Person 2)

Status: Ready to build against. Flag here if anything needs to change once
you're actually implementing - nothing below is locked in stone, just decided
enough to build on rather than left as open questions.

## Goal
Chat needs to feel like it "remembers" - every message sent to Gemini should
include relevant Memory entries and the user's latest Advisor report as
context, not just the current message alone.

## Request shape (frontend -> POST /chat)
```json
{
  "message": "What should I focus on next for my idea?"
}
```
No need to send memory/context from the frontend - the backend fetches it.

## Decided: how memory context is selected
Use `get_memories_for_chat_context(db, user_id, limit=5)` - already built in
`backend/services/memory_service.py`. It returns the top memories by
importance, then most recent. Keyword-matching the live chat message against
Memory was considered and intentionally rejected as the default: it's less
predictable for a live demo (a message might not contain any word that
matches a saved memory). Fixed "most important + most recent" is simpler and
more reliably demonstrates the "AI remembers" story.

## Flow inside POST /chat (backend, Person 2 to implement)
1. Receive the user's message.
2. Call `get_memories_for_chat_context(db, user_id, limit=5)` for Memory context.
3. Fetch the user's most recent `advisor_reports` entry, if any exists.
4. Build a Gemini prompt including:
   - The user's message
   - A short summary of the returned memories (title + content, kept brief)
   - Key fields from the latest Advisor report (idea_score, growth_strategy, next_steps)
5. Send to Gemini, get the response.
6. Save both the user message and the assistant's response to `chat_messages`.
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

## user_id note
`user_id` is currently optional/nullable everywhere (Memory, and presumably
Advisor once built) since Person 1's auth isn't ready yet. Call the context
function with `user_id=None` for now - it will simply pull across all memories
rather than a specific user's. Once auth lands, pass the real `user_id` from
`get_current_user()` and no other code changes should be needed on the Memory
side.

## Fallback for demo safety
If Gemini fails or times out, return a clean error in the standard contract
rather than crashing:
```json
{ "success": false, "data": null, "error": "Chat is temporarily unavailable. Please try again." }
```

## Questions still open for Person 2
- Where should the "fetch latest advisor report" query live - directly in
  your chat service, or should I add a small helper for it? Happy to add one
  if useful, just say the word.