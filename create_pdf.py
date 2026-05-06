from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os

def create_test_pdf(filename, text_content):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    t = c.beginText()
    t.setTextOrigin(100, height - 100)
    t.setFont("Helvetica", 12)
    
    # Split text into lines
    lines = text_content.split('\n')
    for line in lines:
        t.textLine(line)
    
    c.drawText(t)
    c.showPage()
    c.save()

if __name__ == "__main__":
    text = """
Artificial Intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. 
AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.
The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving". 
This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.
AI applications include advanced web search engines (e.g., Google Search), recommendation systems (used by YouTube, Amazon, and Netflix), understanding human speech (such as Siri and Alexa), self-driving cars (e.g., Waymo), generative or creative tools (ChatGPT and AI art), and competing at the highest level in strategic games (such as chess and Go).
    """
    create_test_pdf("real_test.pdf", text)
    print("Created real_test.pdf")
