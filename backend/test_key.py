import os
import requests
from dotenv import load_dotenv

load_dotenv()

groq_key = os.getenv("GROQ_API_KEY", "")
gemini_key = os.getenv("GEMINI_API_KEY", "")

print("=== SkillPilot AI Key Verification ===")

if groq_key:
    print(f"Testing Groq API (Key: {groq_key[:10]}...):")
    try:
        res = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {groq_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-oss-120b",
                "messages": [
                    {"role": "user", "content": "Say 'MoSPI AI is ready!' in 5 words."}
                ],
                "temperature": 0.3
            },
            timeout=10
        )
        if res.status_code == 200:
            content = res.json()["choices"][0]["message"]["content"]
            print(f"[SUCCESS] Groq LLM Connected! Response: {content.strip()}")
        else:
            print(f"[ERROR] Groq Status {res.status_code}: {res.text}")
    except Exception as e:
        print(f"[ERROR] Groq connection failed: {e}")

if gemini_key:
    print(f"\nTesting Gemini API (Key: {gemini_key[:10]}...):")
    try:
        import google.generativeai as genai
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Say hi")
        print(f"[SUCCESS] Gemini LLM Connected! Response: {response.text.strip()}")
    except Exception as e:
        print(f"[ERROR] Gemini connection failed: {e}")

print("\n=== Verification Complete ===")
