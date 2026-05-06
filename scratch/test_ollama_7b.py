import requests
import json

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
payload = {
    "model": "qwen2.5-coder:7b",
    "prompt": "Say 'Ollama is alive' in JSON format.",
    "stream": False
}

try:
    print(f"Testing {payload['model']} at {OLLAMA_URL}...")
    response = requests.post(OLLAMA_URL, json=payload, timeout=30)
    response.raise_for_status()
    print("Success!")
    print(response.json().get("response"))
except Exception as e:
    print(f"Failed: {e}")
