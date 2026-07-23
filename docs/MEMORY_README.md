# Memory Module — Reference

Owned by Person 4. This document lets anyone on the team use the Memory API
without needing to ask first.

## Base URL (local dev)
```
http://127.0.0.1:8000/memory
```

## Response contract
Every endpoint below returns this shape. Always check `success` before using `data`.
```json
{ "success": true, "data": { ... }, "error": null }
{ "success": false, "data": null, "error": "human-readable message" }
```

## Endpoints

### Create a memory
`POST /memory/`
```json
{
  "title": "Investor Meeting",
  "category": "business",
  "content": "Discussed funding strategy for FounderOS AI.",
  "importance": 4,
  "source": "user",
  "tags": "funding,investors"
}
```
Notes:
- `title`, `category`, `content` are required and cannot be empty.
- `importance` must be an integer from 1 to 5 (defaults to 1 if omitted).
- `tags` is optional (defaults to empty string).
- Invalid input (e.g. `importance: 99`) returns `success: false` with a clear
  `error` message — this now applies to every endpoint, not just Memory.

### List all memories
`GET /memory/`

### Search memories
`GET /memory/search?keyword=investor`
Matches against title, content, and tags (case-sensitive substring match).

### Get memories by category
`GET /memory/category/business`
Case-insensitive — `Business`, `business`, and `BUSINESS` all match.

### Get important memories
`GET /memory/important?min_importance=3`
Returns memories with importance >= the given value, sorted highest first.
`min_importance` defaults to 3 if not provided.

### Timeline
`GET /memory/timeline`
Returns all memories sorted newest first, each including `created_at`.

### Retrieve (used internally for Chat context)
`GET /memory/retrieve?keyword=idea`
Same behavior as search — this is the endpoint Chat should call to pull
relevant memory context before generating a response.

## Frontend usage
A ready-to-use service layer already exists:
```
frontend/src/services/api.js       - shared Axios instance, use this, don't make a new one
frontend/src/services/memory.js    - createMemory(), getAllMemories(),
                                      searchMemories(), getMemoryTimeline(),
                                      getMemoriesByCategory(), getImportantMemories()
```
Each function already unwraps the `{success, data, error}` response and throws
a normal JS Error if `success` is false, so calling code can just try/catch.

Example:
```js
import { searchMemories } from "../../services/memory";

try {
  const results = await searchMemories("investor");
  // results is already the plain array of memory objects, ready to render
} catch (err) {
  // err.message is the human-readable error from the backend
}
```

Reusable UI components already built:
```
frontend/src/components/memory/MemorySearch.jsx
frontend/src/components/memory/MemoryTimeline.jsx
frontend/src/components/memory/MemoryCategoryFilter.jsx
```

## Known limitations (current state)
- No `user_id` yet — memories are not scoped per user. This will be added once
  Person 1's auth (`get_current_user`) is ready. Don't build anything that
  assumes per-user isolation until this notice is removed.
- Search is a plain substring match, not semantic search. Vector search is a
  planned future upgrade, not in current scope.

## If something looks broken
Check these in order — they're the actual bugs we've hit and fixed so far:
1. Is the backend actually running? (`uvicorn main:app --reload`, with `venv` activated)
2. CORS — only `localhost:5173` / `127.0.0.1:5173` are currently allowed.
3. Case sensitivity — category filtering is case-insensitive, but search
   (title/content/tags) is still case-sensitive.