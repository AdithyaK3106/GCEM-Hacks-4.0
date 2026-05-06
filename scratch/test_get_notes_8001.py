import requests

session_id = 'ce01b0fb-3072-403b-975e-d344244b87da'
url = f"http://127.0.0.1:8001/notes/{session_id}"

try:
    print(f"Fetching notes from {url}...")
    response = requests.get(url)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
