from celery import shared_task
import requests
from django.conf import settings
from django.utils import timezone
from .models import AnalysisResult

@shared_task
def analyze_resume_task(analysis_id):
    try:
        analysis = AnalysisResult.objects.get(id=analysis_id)
        analysis.status = 'PROCESSING'
        analysis.save()

        resume_file_path = analysis.resume.file.path
        job_description_text = analysis.job_description.description if analysis.job_description else ""

        flask_url = f"{settings.FLASK_AI_URL}/api/analyze"
        
        with open(resume_file_path, 'rb') as f:
            files = {'resume': (analysis.resume.file.name, f, 'application/pdf')}
            data = {'job_description': job_description_text}
            
            response = requests.post(flask_url, files=files, data=data)

        if response.status_code == 200:
            result_data = response.json().get('data', {})
            analysis.ats_score = result_data.get('ats_score', 0.0)
            analysis.skills = result_data.get('skills', [])
            analysis.summary = result_data.get('summary', '')
            analysis.status = 'COMPLETED'
        else:
            analysis.status = 'FAILED'
            analysis.summary = f"Error from AI Service: {response.text}"
            
        analysis.completed_at = timezone.now()
        analysis.save()

    except Exception as e:
        # If any error occurs, update status to failed
        analysis = AnalysisResult.objects.get(id=analysis_id)
        analysis.status = 'FAILED'
        analysis.summary = str(e)
        analysis.completed_at = timezone.now()
        analysis.save()
