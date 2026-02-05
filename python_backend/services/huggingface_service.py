import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

api_key = os.getenv("HF_API_KEY")
print(api_key)
if not api_key:
    raise Exception("Missing Hugging Face API Key in .env")

# Initialize client once
client = InferenceClient(api_key=api_key)
def get_huggingface_response(message: str) -> str:
    completion = client.chat.completions.create(
        model="HuggingFaceH4/zephyr-7b-alpha:featherless-ai",
        messages=[{"role": "user", "content": message}],
        max_tokens=200,  # optional
    )
    answer = completion.choices[0].message.content
    return answer
