import requests
import time
import os

BASE_URL = "http://127.0.0.1:8000"

def reproduce():
    # 1. Upload PDF
    pdf_path = "ML mod 4.pdf"
    if not os.path.exists(pdf_path):
        print(f"{pdf_path} not found")
        return
    
    print(f"Uploading {pdf_path}...")
    with open(pdf_path, "rb") as f:
        files = {"file": (os.path.basename(pdf_path), f, "application/pdf")}
        data = {"target_language": "English"}
        response = requests.post(f"{BASE_URL}/upload", files=files, data=data)
    
    if response.status_code != 200:
        print(f"Upload failed: {response.status_code} - {response.text}")
        return

    res_json = response.json()
    session_id = res_json.get("data", {}).get("session_id")
    print(f"Upload success. Session ID: {session_id}")

    # 2. Get Notes
    print(f"Getting notes for session {session_id}...")
    # The pipeline might be async or takes time, but in this implementation it seems it's sync in the /upload route
    # Wait a bit just in case? No, the code shows it calls process_pdf_pipeline before returning.
    
    response = requests.get(f"{BASE_URL}/notes/{session_id}")
    if response.status_code != 200:
        print(f"Get notes failed: {response.status_code} - {response.text}")
        return
    
    notes_data = response.json().get("data", {})
    topics = notes_data.get("topics", [])
    print(f"Notes received. Number of topics: {len(topics)}")
    if len(topics) == 0:
        print("FAIL: No topics generated.")
    else:
        print("SUCCESS: Topics generated.")
        for i, topic in enumerate(topics):
            print(f"Topic {i+1}: {topic.get('name')}")

if __name__ == "__main__":
    reproduce()
