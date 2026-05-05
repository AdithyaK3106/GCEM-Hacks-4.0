import io
from app.services import logic

def mock_extract(file):
    # just return the bytes decoded
    return file.read().decode('utf-8')

logic.extract_pdf_text = mock_extract

# CASE 1: English input, no language selected (default English)
print("CASE 1: English")
res1 = logic.process_pdf_pipeline("sess1", io.BytesIO(b"Hello world, this is a test. We are learning about AI. " * 50))
print("Language used:", res1.get("target_language"))

# CASE 2: English input, target Hindi
print("CASE 2: English -> Hindi")
res2 = logic.process_pdf_pipeline("sess2", io.BytesIO(b"Hello world, this is a test. We are learning about AI. " * 50), target_language="Hindi")
print("Language used:", res2.get("target_language"))

# CASE 3: Hindi input, target Hindi
print("CASE 3: Hindi -> Hindi")
res3 = logic.process_pdf_pipeline("sess3", io.BytesIO(("नमस्ते दुनिया, यह एक परीक्षण है। हम एआई के बारे में सीख रहे हैं। " * 50).encode('utf-8')), target_language="Hindi")
print("Language used:", res3.get("target_language"))

print("\nAll cases executed. Check logs for LLM translation and generation.")
