import os
import json
from dotenv import load_dotenv
from google import genai
from backend.ai.prompts import get_advisor_prompt

load_dotenv()

def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is missing in .env")
    return genai.Client(api_key=api_key)

def analyze_startup_idea(idea_description: str) -> dict:
    client = get_gemini_client()
    prompt = get_advisor_prompt(idea_description)
    
    # Use an active model (e.g., gemini-2.5-flash or gemini-2.0-flash)
    response = client.models.generate_content(
        model='gemini-3.5-flash',
        contents=prompt,
    )
    
    raw_text = response.text.strip()
    
    # Cleanup markdown code blocks if Gemini wraps output in ```json ... ```
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]
    if raw_text.startswith("```"):
        raw_text = raw_text[3:]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
        
    raw_text = raw_text.strip()
    
    return json.loads(raw_text)