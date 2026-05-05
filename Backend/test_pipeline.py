import os
import io
import json
from app.services import logic

def test_chunking():
    print("\n--- TEST: CHUNKING ---")
    text = "word " * 1000
    chunks = logic.chunk_text(text, max_tokens=200)
    print(f"Text split into {len(chunks)} chunks.")
    assert len(chunks) > 1
    print("PASS: Chunking Logic")

def test_json_extraction():
    print("\n--- TEST: ROBUST JSON EXTRACTION ---")
    bad_json = "Here is some text before { \"key\": \"value\" } and some text after."
    data = logic.extract_json(bad_json)
    assert data == {"key": "value"}
    
    array_json = "Text [{\"q\": 1}, {\"q\": 2}] more text"
    data = logic.extract_json(array_json)
    assert len(data) == 2
    print("PASS: Robust JSON Extraction")

def test_full_pipeline_mock():
    print("\n--- TEST: FULL PIPELINE MOCK ---")
    session_id = "test_session"
    # This will trigger fallback if Ollama isn't reachable, 
    # but we're testing the logic flow.
    res = logic.process_pdf_pipeline(session_id, io.BytesIO(b"Artificial Intelligence is a branch of computer science... " * 100))
    assert "notes" in res
    assert "quiz" in res
    print("PASS: Pipeline Flow")

if __name__ == "__main__":
    try:
        test_chunking()
        test_json_extraction()
        test_full_pipeline_mock()
        print("\nALL MODERN PIPELINE TESTS PASSED")
    except Exception as e:
        print(f"\nTEST FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
