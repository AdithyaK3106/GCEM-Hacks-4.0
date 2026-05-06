Kiimport requests
import json
import os

BASE_URL = "http://127.0.0.1:8000"
FILE_PATH = r"C:\Users\urbra\OneDrive\Desktop\Projects\Gopalan Hackathon\ML mod 4.pdf"

def run_ml_audit():
    print(f"[AUDIT] TESTING REAL PDF: {os.path.basename(FILE_PATH)}")
    
    if not os.path.exists(FILE_PATH):
        print(f"ERROR: File not found at {FILE_PATH}")
        return

    # 1. Upload the real PDF
    print("\n[STEP 1] Uploading Real PDF...")
    with open(FILE_PATH, 'rb') as f:
        files = {'file': (os.path.basename(FILE_PATH), f, 'application/pdf')}
        data = {'target_language': 'English'}
        
        try:
            up_res = requests.post(f"{BASE_URL}/upload", files=files, data=data, timeout=180)
            up_data = up_res.json()
            
            if up_data.get("status") != "success" or "failed" in up_data["data"]["transcript_text"].lower():
                print(f"UPLOAD FAILED: {up_data}")
                return
            
            session_id = up_data["data"]["session_id"]
            print(f"Upload Successful. Session: {session_id}")
            print(f"Extracted Preview: {up_data['data']['transcript_text'][:200]}...")
            
            # 2. Fetch Notes
            print("\n[STEP 2] Fetching Synthesized Notes...")
            notes_res = requests.get(f"{BASE_URL}/notes/{session_id}")
            notes_data = notes_res.json()
            
            if not notes_data["data"]["topics"]:
                print("NOTES FAILED: Returned empty topics.")
            else:
                print(f"Notes Extracted: {len(notes_data['data']['topics'])} topics found.")
                for i, t in enumerate(notes_data['data']['topics']):
                    print(f"  {i+1}. {t['name']}")
                    
            # 3. Fetch Quiz
            print("\n[STEP 3] Fetching Mastery Quiz...")
            quiz_res = requests.get(f"{BASE_URL}/quiz/{session_id}")
            quiz_data = quiz_res.json()
            
            if not quiz_data["data"]:
                print("QUIZ FAILED: Returned empty questions.")
            else:
                print(f"Quiz Generated: {len(quiz_data['data'])} questions found.")
                for i, q in enumerate(quiz_data['data'][:2]):
                    print(f"  Q{i+1}: {q['question_text']}")

            print("\nREAL PDF AUDIT COMPLETE: Pipeline is healthy.")
            
        except Exception as e:
            print(f"AUDIT CRASHED: {e}")

if __name__ == "__main__":
    run_ml_audit()
