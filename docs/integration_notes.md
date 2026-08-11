# Integration Notes — Person 4

Running log of real decisions, bugs found, and patterns established while
building Memory. Read this before Days 8-15 integration — several of these
apply to every module, not just Memory.

## Patterns every module should follow

**1. Route ordering matters in FastAPI.**
Fixed-string routes (`/search`, `/timeline`, `/stats`) MUST be declared before
any dynamic route like `/{id}` in the same router. Otherwise `/timeline`
matches `/{id}` first, tries to cast "timeline" to an int, and fails with a
422. This bit Memory once already — check every router for this before
merging.

**2. Case sensitivity on text matching.**
SQLite string comparisons are case-sensitive by default. Any filter/match on
user-typed or stored text (category, status, tags) should either normalize on
save or compare with `func.lower(...)` on both sides. Memory's category filter
had this bug; fixed.

**3. Global error contract.**
`main.py` now has three exception handlers so EVERY response - success,
validation error, 404, or unexpected crash - returns
`{success, data, error}`. Don't add per-endpoint try/except blocks that
return a different shape; let the global handlers do it. This applies
automatically to every router included in `main.py`.

**4. Always include `created_at` in response schemas, not just DB models.**
Missed once, broke the timeline UI silently until it was actually tested in
the browser.

**5. `user_id` is optional/nullable everywhere right now.**
Memory's `user_id` column is nullable since auth isn't ready. Don't filter
by `user_id` yet anywhere - it would just return empty results since nothing
has a real user_id set. Once Person 1's `get_current_user()` exists, swap in
the already-built `get_memories_by_user()` / `get_memories_for_chat_context()`
helpers.

## Testing discipline

Reading code is not enough - every bug listed above was invisible until the
feature was actually run in the browser or tested against a real request.
Before calling anything "done":
1. Run backend + frontend together, click through it for real.
2. Check the browser console (F12) for red errors.
3. For backend-only changes, run `backend/test_memory_endpoints.py` (or the
   equivalent for your module, if you build one) rather than only checking
   Swagger by hand.

## Known gaps, on purpose

- Memory search is plain substring match, not semantic. Fine for now.
- No pagination UI yet (backend supports `skip`/`limit`, frontend doesn't use
  them yet - fine until there's enough real data to need it).
- CORS is only configured for `localhost:5173` / `127.0.0.1:5173`. Needs an
  update from Person 1 once a staging/production URL exists.

## File locations reference

```
backend/models/memory.py            - Memory table definition
backend/schemas/memory.py           - Request/response validation
backend/services/memory_service.py  - All DB query logic
backend/api/memory.py               - Routes (order matters, see above)
backend/main.py                     - CORS + global error handlers live here
backend/test_memory_endpoints.py    - Run this after any Memory change
frontend/src/services/api.js        - Shared Axios instance, use this
frontend/src/services/memory.js     - All Memory API calls, already unwrap {success, data, error}
frontend/src/components/memory/     - MemorySearch, MemoryTimeline, MemoryCategoryFilter, MemoryCreateForm
frontend/src/pages/Memory.jsx       - Assembled page combining all four components
docs/chat_context_contract.md       - Finalized spec for Person 2's Chat module
