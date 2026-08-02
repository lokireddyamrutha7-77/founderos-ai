import time
from backend.ai.gemini_client import analyze_startup_idea

test_ideas = [
    "An AI-powered CRM designed specifically for independent real estate agents.",
    "A peer-to-peer rental marketplace for high-end camping and outdoor gear.",
    "A monthly subscription box service delivering rare indoor plants with care guides."
]

for i, idea in enumerate(test_ideas, 1):
    print(f"\n--- Testing Idea {i}: {idea[:35]}... ---")
    try:
        result = analyze_startup_idea(idea)
        print(f"✅ Success! Score: {result.get('idea_score')}/100")
        print(f"Keys returned: {list(result.keys())}")
    except Exception as e:
        print(f"❌ Failed for Idea {i}: {e}")
        
    # Pause for 3 seconds between calls to respect Gemini Free Tier rate limits
    time.sleep(3)