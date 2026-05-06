from pypdf import PdfReader
import sys

def debug_pdf(path):
    try:
        reader = PdfReader(path)
        print(f"Pages: {len(reader.pages)}")
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            print(f"Page {i+1} text length: {len(text) if text else 0}")
            if text:
                print(f"Preview: {text[:100]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_pdf("ML mod 4.pdf")
