import os
import io
import json
import sys

# Add Backend to path
sys.path.append(os.path.join(os.getcwd(), "Backend"))

from app.services import logic

def test_ml_pdf():
    print("\n--- TESTING: ML mod 4.pdf ---")
    
    pdf_path = "ML mod 4.pdf"
    if not os.path.exists(pdf_path):
        print(f"ERROR: File not found at {pdf_path}")
        # Try relative to script
        pdf_path = os.path.join(os.path.dirname(__file__), "..", "ML mod 4.pdf")
        if not os.path.exists(pdf_path):
             print(f"ERROR: File still not found at {pdf_path}")
             return

    print(f"Loading {pdf_path}...")
    with open(pdf_path, "rb") as f:
        file_content = f.read()
        file_obj = io.BytesIO(file_content)
        filename = "ML mod 4.pdf"

    session_id = "ml_pdf_test_session"
    
    # Ensure DEMO_MODE is False
    logic.toggle_demo_mode(False)
    
    print("Running pipeline (this may take a minute)...")
    try:
        res = logic.process_pdf_pipeline(session_id, file_obj, target_language="English", filename=filename)
        
        print("\n--- RESULTS ---")
        notes = res.get("notes", {})
        topics = notes.get("topics", [])
        
        print(f"Note Title: {notes.get('topic_title')}")
        print(f"Number of Topics Found: {len(topics)}")
        
        if topics:
            for i, topic in enumerate(topics):
                print(f"\n[Topic {i+1}: {topic.get('name')}]")
                print(f"Summary: {topic.get('summary')}")
                print(f"Intuition: {topic.get('intuition')}")
                print(f"Key Concepts: {', '.join(topic.get('key_concepts', []))}")
        else:
            print("FAIL: No topics generated.")
            
        quiz = res.get("quiz", [])
        print(f"\nNumber of Quiz Questions: {len(quiz)}")
        if quiz:
             print(f"First Question: {quiz[0].get('question_text')}")

    except Exception as e:
        print(f"Pipeline failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_ml_pdf()
