import requests

url = "http://127.0.0.1:8001/upload"
files = {'file': ('test.txt', 'This is a long test file about Artificial Intelligence. ' * 20)}
data = {'target_language': 'English'}

try:
    print(f"Uploading to {url}...")
    response = requests.post(url, files=files, data=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
