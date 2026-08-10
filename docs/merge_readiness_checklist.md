# Merge &amp; Integration Readiness Checklist

For use starting Days 8-15, once teammates' branches have real work to merge.
This is the process Person 4 follows for every PR before merging into develop.

## Before merging any branch into develop

1. **Pull latest develop first**, merge it into the feature branch, resolve
   conflicts there - never merge a stale feature branch directly.
   ```
   git checkout develop
   git pull origin develop
   git checkout feature/personX-module
   git merge develop
   ```

2. **Check the response contract.** Every endpoint in the PR must return
   `{success, data, error}`. If a route uses `HTTPException` or raises
   manually, confirm `main.py`'s global exception handlers actually cover it
   (they do, for `RequestValidationError`, `HTTPException`, and generic
   `Exception` - don't let anyone re-invent per-route error handling).

3. **Check route ordering** if the module has any dynamic `/{id}` style
   routes. Fixed-string routes must come first in the file. (This bit Memory
   once - see `integration_notes.md`.)

4. **Check for `created_at` / `updated_at`** in every response schema, not
   just the DB model.

5. **Check case sensitivity** on any text-based filter or match logic.

6. **Run the module's own test script if one exists** (e.g.
   `test_memory_endpoints.py`) before merging, not after.

7. **Actually run the app** - backend + frontend together, click through the
   new feature in the browser. Don't merge on code review alone.

8. **Check CORS** isn't accidentally scoped only to a teammate's personal
   dev port.

## After merging

1. Pull the new `develop` into your own branch immediately, so you're not
   working against a stale base for long.
2. Re-run the golden demo path once, end-to-end, to confirm the merge didn't
   break the core flow.
3. Log any new bugs found into the shared bug list - don't silently fix
   something that isn't yours without a quick note to whoever owns it.

## Merge conflict resolution - general approach

1. Never resolve a conflict in a file you don't understand by guessing -
   message the owner first if unsure which side is correct.
2. Prefer keeping both changes when they touch different logic in the same
   file (common with `main.py` as more routers get added - each router
   registration is usually a non-conflicting addition).
3. After resolving, always re-test the specific feature that was touched,
   not just confirm the merge completed.

## Red flags to stop and ask before merging

- A PR changes the shared response contract shape.
- A PR modifies `main.py`'s exception handlers or CORS config.
- A PR changes an existing database table's columns in a way that isn't
  backward compatible (dropping a column, changing a type).
- A PR touches another module's files without a heads-up first.