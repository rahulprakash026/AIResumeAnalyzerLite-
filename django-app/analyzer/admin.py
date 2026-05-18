from django.contrib import admin
from .models import Resume, JobDescription, AnalysisResult

admin.site.register(Resume)
admin.site.register(JobDescription)
admin.site.register(AnalysisResult)
