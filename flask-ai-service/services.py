import os
import io
import json
import PyPDF2
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

def analyze_resume_full(resume_text, job_description):
    """
    Analyzes the resume dynamically based on content, skills, experience, projects, 
    education, and keywords matching the job description.
    """
    
    if not OPENAI_API_KEY or "your_openai_api_key_here" in OPENAI_API_KEY:
        # Fallback Mock Data if OpenAI API key is missing
        return {
            "score": 65,
            "status": "Average",
            "summary": "This is a mock analysis because no OpenAI key was provided. The candidate shows some relevant skills.",
            "sections": {
                "experience": 70,
                "education": 80,
                "skills": 60,
                "formatting": 75
            },
            "matchedSkills": ["Python", "Mock Data"],
            "missingSkills": ["Actual AI Analysis", "API Key"],
            "recommendations": ["Add a valid OpenAI API Key to the .env file to enable dynamic AI analysis."],
            "strengths": ["Basic formatting"],
            "weaknesses": ["Missing core requirements"]
        }

    prompt = f"""
You are an expert AI Resume Analyzer and senior technical recruiter. 
Analyze the provided resume against the provided job description (if any).

IMPORTANT RULES:
1. Analyze dynamically based on the actual resume content, skills, experience, projects, education, and ATS optimization.
2. The ATS score must accurately reflect the resume's quality and alignment with the job description.
3. If the resume has strong projects, increase the project/experience score.
4. If the resume lacks keywords from the job description, reduce the ATS score.
5. If the formatting appears poor (based on text extraction coherence), reduce the formatting score.
6. The executive summary must be realistic, highly personalized, and unique for this specific candidate.
7. You MUST return your response ENTIRELY as a valid JSON object matching the exact format below, with NO markdown formatting, NO backticks, and NO additional text.

JSON FORMAT:
{{
  "score": number (0-100),
  "status": "Excellent" | "Good" | "Average" | "Poor",
  "summary": "Personalized analysis summary",
  "sections": {{
    "experience": number (0-100),
    "education": number (0-100),
    "skills": number (0-100),
    "formatting": number (0-100)
  }},
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "recommendations": ["rec1", "rec2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"]
}}

---
JOB DESCRIPTION:
{job_description}

---
RESUME TEXT:
{resume_text[:4000]}
"""

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-1106",  # Use a model that supports JSON mode well
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are a specialized JSON-generating AI."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2, # Lower temperature for more consistent JSON structure
            max_tokens=1500
        )
        
        result_content = response.choices[0].message.content
        parsed_json = json.loads(result_content)
        return parsed_json
        
    except json.JSONDecodeError as e:
        print(f"Error parsing OpenAI JSON response: {e}")
        raise Exception("OpenAI returned invalid JSON.")
    except Exception as e:
        print(f"Error during OpenAI API call: {e}")
        raise Exception(f"Failed to analyze resume: {str(e)}")
