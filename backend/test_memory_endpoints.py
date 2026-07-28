"""
Quick regression test for the Memory module.
Run this any time you change memory.py, memory_service.py, or the schema,
to confirm nothing broke. Requires the backend to be running locally first:

    uvicorn main:app --reload

Then in a separate terminal (with venv activated):

    python test_memory_endpoints.py
"""

import requests

BASE = "http://127.0.0.1:8000/memory"


def check(label, condition):
    status = "PASS" if condition else "FAIL"
    print(f"[{status}] {label}")
    return condition


def main():
    all_passed = True

    # 1. Create a memory
    payload = {
        "title": "Regression Test Entry",
        "category": "note",
        "content": "This entry was created by the automated test script.",
        "importance": 2,
        "source": "test",
        "tags": "test,automated",
    }
    r = requests.post(f"{BASE}/", json=payload)
    body = r.json()
    all_passed &= check("Create memory returns 200", r.status_code == 200)
    all_passed &= check("Create memory success=true", body.get("success") is True)
    memory_id = body.get("data", {}).get("id")
    all_passed &= check("Create memory returns an id", memory_id is not None)

    # 2. Get all memories
    r = requests.get(f"{BASE}/")
    body = r.json()
    all_passed &= check("Get all memories returns 200", r.status_code == 200)
    all_passed &= check("Get all memories returns a list", isinstance(body.get("data"), list))

    # 3. Get single memory by id
    r = requests.get(f"{BASE}/{memory_id}")
    body = r.json()
    all_passed &= check("Get single memory returns 200", r.status_code == 200)
    all_passed &= check(
        "Get single memory returns correct title",
        body.get("data", {}).get("title") == "Regression Test Entry",
    )

    # 4. Update the memory
    updated_payload = dict(payload)
    updated_payload["title"] = "Regression Test Entry (Updated)"
    r = requests.put(f"{BASE}/{memory_id}", json=updated_payload)
    body = r.json()
    all_passed &= check("Update memory returns 200", r.status_code == 200)
    all_passed &= check(
        "Update memory reflects new title",
        body.get("data", {}).get("title") == "Regression Test Entry (Updated)",
    )

    # 5. Search finds it
    r = requests.get(f"{BASE}/search", params={"keyword": "Regression"})
    body = r.json()
    all_passed &= check("Search returns 200", r.status_code == 200)
    all_passed &= check("Search finds the test entry", len(body.get("data", [])) >= 1)

    # 6. Timeline includes it
    r = requests.get(f"{BASE}/timeline")
    all_passed &= check("Timeline returns 200", r.status_code == 200)

    # 7. Category filter (case-insensitive check)
    r = requests.get(f"{BASE}/category/NOTE")
    body = r.json()
    all_passed &= check("Category filter is case-insensitive", r.status_code == 200)
    all_passed &= check(
        "Category filter finds the test entry",
        any(m["id"] == memory_id for m in body.get("data", [])),
    )

    # 8. Invalid input rejected cleanly (importance out of range)
    bad_payload = dict(payload)
    bad_payload["importance"] = 99
    r = requests.post(f"{BASE}/", json=bad_payload)
    body = r.json()
    all_passed &= check("Invalid importance rejected (not 200)", r.status_code != 200)
    all_passed &= check("Invalid importance returns success=false", body.get("success") is False)
    all_passed &= check("Invalid importance returns a clear error message", bool(body.get("error")))

    # 9. Delete the memory
    r = requests.delete(f"{BASE}/{memory_id}")
    body = r.json()
    all_passed &= check("Delete memory returns 200", r.status_code == 200)
    all_passed &= check("Delete memory success=true", body.get("success") is True)

    # 10. Deleting again returns a clean 404
    r = requests.delete(f"{BASE}/{memory_id}")
    body = r.json()
    all_passed &= check("Delete missing memory returns 404", r.status_code == 404)
    all_passed &= check("Delete missing memory returns success=false", body.get("success") is False)

    print()
    print("ALL TESTS PASSED" if all_passed else "SOME TESTS FAILED - see above")


if __name__ == "__main__":
    main()