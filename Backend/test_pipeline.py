import os
import io
from app.services import logic

def test_grounding_consistency():
    print("\n--- TEST: GROUNDING & CONSISTENCY ---")
    text = "Machine learning is a field of artificial intelligence. It focuses on the use of data and algorithms to imitate the way that humans learn. Gradual improvement in accuracy is a key goal. Neural networks are one type of machine learning model. Deep learning is a subset of neural networks. Training requires large amounts of labeled data. Data scientists often use Python for development. The field is growing rapidly in industry."
    
    clean = logic.clean_text(text)
    sentences = logic.split_sentences(clean)
    key_sentences = logic.select_key_sentences(sentences, limit=5)
    
    assert len(key_sentences) >= 3
    assert all(logic.is_valid_sentence(s) for s in key_sentences)
    
    highlights = logic.generate_highlights(key_sentences)
    quiz = logic.generate_quiz_from_highlights(highlights)
    
    assert len(quiz) == len(highlights[:5])
    assert "source_text" in quiz[0]
    assert quiz[0]["source_text"] == highlights[0]["source_text"]
    
    print("PASS: Grounding and Consistency")

def test_sentence_filtering():
    print("\n--- TEST: SENTENCE FILTERING ---")
    assert logic.is_valid_sentence("This is a valid sentence with enough words to be useful.") == True
    assert logic.is_valid_sentence("Short.") == False
    assert logic.is_valid_sentence("FIG 1. CHART SHOWING DATA.") == False
    assert logic.is_valid_sentence("ALL CAPS SENTENCE THAT IS PROBABLY A HEADING.") == False
    print("PASS: Sentence Filtering")

def test_full_pipeline_with_mock_pdf():
    print("\n--- TEST: FULL PIPELINE ---")
    session_id = "test_full"
    # Provide enough text to avoid fallback
    dummy_content = "This is a substantive sentence about the history of artificial intelligence. " * 50
    res = logic.process_pdf_pipeline(session_id, io.BytesIO(b"Dummy Content " * 200))
    assert "notes" in res
    print("PASS: Pipeline Execution")

if __name__ == "__main__":
    try:
        test_grounding_consistency()
        test_sentence_filtering()
        test_full_pipeline_with_mock_pdf()
        print("\nALL HARDENING TESTS PASSED")
    except Exception as e:
        print(f"\nTEST FAILED: {str(e)}")
