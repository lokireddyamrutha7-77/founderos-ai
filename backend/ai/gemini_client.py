import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def get_gemini_client():
    """Initializes and returns the official Gemini client."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("CRITICAL: GEMINI_API_KEY is missing from your .env file!")
    
    return genai.Client(api_key=api_key)

def test_connectivity():
    """Tests the connection to Gemini to ensure Day 0 success."""
    try:
        print("Attempting to connect to Gemini API...")
        client = get_gemini_client()
        
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents='Respond with the single word: "Connected!"'
        )
        print(f"\n🎉 Success! Gemini API Status: {response.text.strip()}")
        return True
    except Exception as e:
        print(f"\n❌ Connection Failed: {e}")
        return False

if __name__ == "__main__":
    test_connectivity()