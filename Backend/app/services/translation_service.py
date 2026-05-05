import logging
from app.services.logic import call_ollama, NOTES_MODEL

logger = logging.getLogger("TranslationLayer")

def translate_text(text: str, target_language: str) -> str:
    """Minimal, safe translation layer using LLM."""
    if not text or target_language.lower() == "english":
        return text
        
    prompt = f"Translate the following text into {target_language}. If the text is already in {target_language}, return it exactly as is. Preserve the meaning exactly. Do not summarize. Return ONLY the plain text translation.\n\nText:\n{text}"
    translated = call_ollama(NOTES_MODEL, prompt)
    
    return translated.strip() if translated else text
