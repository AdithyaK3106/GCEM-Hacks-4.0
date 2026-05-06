import requests
import time
import json

BASE_URL = "http://127.0.0.1:8000" # Testing against the main port

def run_audit():
    print("[AUDIT] STARTING SYSTEM AUDIT...")
    
    # 1. Create a dummy lecture file
    lecture_content = """
    The Global Positioning System (GPS) is a satellite-based radionavigation system owned by the United States government and operated by the United States Space Force. 
    It is one of the global navigation satellite systems (GNSS) that provides geolocation and time information to a GPS receiver anywhere on or near the Earth.
    GPS operates independently of any telephonic or internet reception, though these technologies can enhance the usefulness of the GPS positioning information.
    The GPS system was originally developed by the U.S. Department of Defense for military use but was opened to civilian use in the 1980s.
    """
    
    # 2. Upload the "PDF" (as text for simplicity of extraction)
    print("\n[STEP 1] Uploading Lecture...")
    files = {'file': ('gps_lecture.txt', lecture_content)}
    data = {'target_language': 'English'}
    
    try:
        up_res = requests.post(f"{BASE_URL}/upload", files=files, data=data, timeout=30)
        up_data = up_res.json()
        if up_data.get("status") != "success" or "analysis failed" in up_data["data"]["transcript_text"].lower():
            print(f"UPLOAD FAILED: {up_data}")
            return
        
        session_id = up_data["data"]["session_id"]
        print(f"Upload Successful. Session: {session_id}")
        
        # 3. Fetch Notes
        print("\n[STEP 2] Fetching Synthesized Notes...")
        # Give LLM a bit of time if needed (though backend is synchronous for now)
        notes_res = requests.get(f"{BASE_URL}/notes/{session_id}")
        notes_data = notes_res.json()
        
        if not notes_data["data"]["topics"]:
            print("NOTES FAILED: Returned empty topics.")
        else:
            print(f"Notes Extracted: {len(notes_data['data']['topics'])} topics found.")
            print(f"   Primary Topic: {notes_data['data']['topics'][0]['name']}")
            
        # 4. Fetch Quiz
        print("\n[STEP 3] Fetching Mastery Quiz...")
        quiz_res = requests.get(f"{BASE_URL}/quiz/{session_id}")
        quiz_data = quiz_res.json()
        
        if not quiz_data["data"]:
            print("QUIZ FAILED: Returned empty questions.")
        else:
            print(f"Quiz Generated: {len(quiz_data['data'])} questions found.")
            q_id = quiz_data["data"][0]["q_id"]
            
            # 5. Test Intelligence Layer (Submit Answer)
            print("\n[STEP 4] Testing Intelligence Layer (Submission)...")
            # Simulating a correct answer
            submit_data = {
                "question_id": q_id,
                "selected_option": 0, # Assuming first is correct for demo
                "confidence": 0.95,
                "time_taken": 12
            }
            sub_res = requests.post(f"{BASE_URL}/submit/{session_id}", json=submit_data)
            sub_json = sub_res.json()
            
            print(f"Submission Successful.")
            print(f"   Learner State: {sub_json['data']['learner_state']['state_label']}")
            print(f"   Insight: {sub_json['data']['learner_state']['message']}")

        print("\nAUDIT COMPLETE: System is fully operational.")
    except Exception as e:
        print(f"AUDIT CRASHED: {e}")

if __name__ == "__main__":
    run_audit()
