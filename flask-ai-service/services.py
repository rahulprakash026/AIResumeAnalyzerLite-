import os
import io
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import openai

# Set up OpenAI key (Optional, can fallback to mock if not provided)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

def extract_text_from_pdf(file_bytes):
    """Extracts text from a PDF file stream."""
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

def calculate_ats_score(resume_text, job_description):
    """Calculates ATS score using cosine similarity."""
    if not resume_text or not job_description:
        return 0.0
    
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return round(similarity * 100, 2)
    except Exception as e:
        print(f"Error calculating ATS score: {e}")
        return 0.0

def extract_skills(resume_text):
    """Extracts skills from resume text. Uses OpenAI if available, else mocks."""
    if not OPENAI_API_KEY or "your_openai_api_key_here" in OPENAI_API_KEY:
        # Mock skill extraction
        common_skills = ["Python", "Django", "Flask", "Docker", "AWS", "SQL", "PostgreSQL", "React", "JavaScript"]
        found_skills = [skill for skill in common_skills if skill.lower() in resume_text.lower()]
        return found_skills if found_skills else ["Communication", "Problem Solving"]
    
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert ATS system. Extract a comma-separated list of technical and soft skills from the following resume text."},
                {"role": "user", "content": resume_text[:2000]} # Limit to 2000 chars for cost
            ],
            max_tokens=50,
            temperature=0.3
        )
        skills = response.choices[0].message.content.split(',')
        return [s.strip() for s in skills if s.strip()]
    except Exception as e:
        print(f"Error extracting skills: {e}")
        return [f"Error extracting skills: {str(e)}"]

def generate_summary(resume_text):
    """Generates a summary of the resume. Uses OpenAI if available, else mocks."""
    if not OPENAI_API_KEY or "your_openai_api_key_here" in OPENAI_API_KEY:
        return "This is a mock summary. The candidate has experience matching some of the keywords in the job description."
    
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert recruiter. Provide a 2-3 sentence summary of the candidate's strengths based on the resume text."},
                {"role": "user", "content": resume_text[:2000]}
            ],
            max_tokens=100,
            temperature=0.5
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating summary: {e}")
        return f"Could not generate summary: {str(e)}"
