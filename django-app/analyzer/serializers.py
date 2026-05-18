from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Resume, JobDescription, AnalysisResult

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class JobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobDescription
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
        read_only_fields = ('user', 'uploaded_at')

class AnalysisResultSerializer(serializers.ModelSerializer):
    resume_details = ResumeSerializer(source='resume', read_only=True)
    job_details = JobDescriptionSerializer(source='job_description', read_only=True)

    class Meta:
        model = AnalysisResult
        fields = '__all__'
        read_only_fields = ('status', 'ats_score', 'skills', 'summary', 'created_at', 'completed_at')
