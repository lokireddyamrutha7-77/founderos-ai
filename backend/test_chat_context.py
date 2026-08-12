"""
Regression unit test for get_memories_for_chat_context service function.
Verifies data isolation by user_id, required user_id parameter, empty list handling,
importance-then-recency sorting, and limit constraints.

To run:
    python backend/test_chat_context.py
"""

import os
import sys
from datetime import datetime, timedelta, timezone

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add current directory to path so relative imports work seamlessly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.db import Base
from models.memory import Memory
from services.memory_service import get_memories_for_chat_context


def check(label, condition):
    status = "PASS" if condition else "FAIL"
    print(f"[{status}] {label}")
    return condition


def create_test_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return Session()


def main():
    all_passed = True
    db = create_test_db()

    # 1. Verification: Only the specified user's memories are returned, not other users'
    mem_u1 = Memory(user_id=1, title="User 1 Note", category="note", content="Secret user 1 data", importance=3)
    mem_u2 = Memory(user_id=2, title="User 2 Note", category="note", content="Secret user 2 data", importance=3)
    db.add_all([mem_u1, mem_u2])
    db.commit()

    u1_memories = get_memories_for_chat_context(db, user_id=1)
    all_passed &= check(
        "Only specified user's memories are returned (user_id=1)",
        len(u1_memories) == 1 and u1_memories[0].user_id == 1 and u1_memories[0].title == "User 1 Note"
    )

    u2_memories = get_memories_for_chat_context(db, user_id=2)
    all_passed &= check(
        "Only specified user's memories are returned (user_id=2)",
        len(u2_memories) == 1 and u2_memories[0].user_id == 2 and u2_memories[0].title == "User 2 Note"
    )

    # 2. Verification: Function requires user_id (calling without raises TypeError)
    type_error_raised = False
    try:
        get_memories_for_chat_context(db)
    except TypeError:
        type_error_raised = True
    all_passed &= check(
        "Calling get_memories_for_chat_context without user_id raises TypeError",
        type_error_raised
    )

    # 3. Verification: No matching memories returns an empty list []
    empty_memories = get_memories_for_chat_context(db, user_id=999)
    all_passed &= check(
        "User with no memories returns an empty list []",
        isinstance(empty_memories, list) and len(empty_memories) == 0
    )

    # 4. Verification: Results are ordered importance-first, then most recent
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    m_low_new = Memory(user_id=3, title="Low Importance New", category="note", content="c1", importance=1, created_at=now)
    m_high_old = Memory(user_id=3, title="High Importance Old", category="note", content="c2", importance=5, created_at=now - timedelta(hours=2))
    m_high_new = Memory(user_id=3, title="High Importance New", category="note", content="c3", importance=5, created_at=now - timedelta(hours=1))
    m_med_newer = Memory(user_id=3, title="Med Importance Newer", category="note", content="c4", importance=3, created_at=now)
    db.add_all([m_low_new, m_high_old, m_high_new, m_med_newer])
    db.commit()

    u3_memories = get_memories_for_chat_context(db, user_id=3)
    # Expected order for user 3:
    # 1. High Importance New (imp=5, newer)
    # 2. High Importance Old (imp=5, older)
    # 3. Med Importance Newer (imp=3)
    # 4. Low Importance New (imp=1)
    expected_titles = [
        "High Importance New",
        "High Importance Old",
        "Med Importance Newer",
        "Low Importance New",
    ]
    actual_titles = [m.title for m in u3_memories]
    all_passed &= check(
        "Results ordered importance-first, then most recent",
        actual_titles == expected_titles
    )

    # 5. Verification: At most `limit` records returned, defaulting to 5
    # Add 7 memories for user 4
    u4_memories_to_add = [
        Memory(user_id=4, title=f"User 4 Note {i}", category="note", content=f"content {i}", importance=i, created_at=now - timedelta(minutes=i))
        for i in range(1, 8)
    ]
    db.add_all(u4_memories_to_add)
    db.commit()

    u4_default_limit = get_memories_for_chat_context(db, user_id=4)
    all_passed &= check(
        "Default limit returns at most 5 records",
        len(u4_default_limit) == 5
    )

    u4_custom_limit = get_memories_for_chat_context(db, user_id=4, limit=3)
    all_passed &= check(
        "Custom limit (limit=3) returns at most 3 records",
        len(u4_custom_limit) == 3
    )

    print()
    print("ALL TESTS PASSED" if all_passed else "SOME TESTS FAILED - see above")


if __name__ == "__main__":
    main()
