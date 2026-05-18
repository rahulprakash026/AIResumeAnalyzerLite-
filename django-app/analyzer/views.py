from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from .models import Resume, JobDescription, AnalysisResult
from .serializers import (
    UserSerializer, ResumeSerializer, 
    JobDescriptionSerializer, AnalysisResultSerializer
)
from .tasks import analyze_resume_task

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class JobDescriptionViewSet(viewsets.ModelViewSet):
    serializer_class = JobDescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobDescription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AnalysisResultViewSet(viewsets.ModelViewSet):
    serializer_class = AnalysisResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        return AnalysisResult.objects.filter(resume__user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        resume_id = request.data.get('resume')
        job_description_id = request.data.get('job_description')

        if not resume_id:
            return Response({'error': 'resume is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)

        job_desc = None
        if job_description_id:
            try:
                job_desc = JobDescription.objects.get(id=job_description_id, user=request.user)
            except JobDescription.DoesNotExist:
                return Response({'error': 'Job Description not found'}, status=status.HTTP_404_NOT_FOUND)

        # Create pending analysis result
        analysis = AnalysisResult.objects.create(
            resume=resume,
            job_description=job_desc,
            status='PENDING'
        )

        # Trigger Celery Task
        analyze_resume_task.delay(analysis.id)

        serializer = self.get_serializer(analysis)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
