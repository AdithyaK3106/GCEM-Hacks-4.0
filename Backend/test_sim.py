import logging
import sys

logging.basicConfig(level=logging.INFO, stream=sys.stdout)

from app.services.logic import process_pdf_pipeline
import time

if __name__ == "__main__":
    start = time.time()
    # Simulate the "demo" case (short file)
    res = process_pdf_pipeline('test-sess-hindi', None, 'Hindi')
    print("Time taken:", time.time() - start)
    print("RES_NOTES:", res.get('notes', {}).get('note_id'))
    print("RES_TOPICS_COUNT:", len(res.get('notes', {}).get('topics', [])))
    print("RES_QUIZ_COUNT:", len(res.get('quiz', [])))
