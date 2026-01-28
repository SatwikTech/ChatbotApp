import os
import requests

def get_openai_response(message: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise Exception("Missing OpenAI API Key")

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": message}],
        },
    )

    data = response.json()
    if response.status_code != 200:
        raise Exception(data.get("error", {}).get("message", "Unknown error"))

    return data.get("choices", [{}])[0].get("message", {}).get("content", "No response from model.")