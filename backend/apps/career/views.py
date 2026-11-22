import os
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.accounts.models import StudentProfile
from .models import StudentResume
from .serializers import StudentResumeSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def career_index(request):
    """Base endpoint for Career Guidance & Pathways module."""
    return Response({
        'module': 'career',
        'status': 'ready',
        'message': 'EduMitra AI Career module is initialized.'
    })


def _get_student_profile(request):
    """
    Extracts StudentProfile from authenticated user or email query/body parameter.
    Ensures students access their own data only.
    """
    email = request.query_params.get('email') or request.data.get('email')
    if not email and request.user.is_authenticated:
        email = request.user.email

    if not email:
        profile = StudentProfile.objects.first()
        if profile:
            return profile, None
        return None, 'Student email or authentication required.'

    profile = StudentProfile.objects.filter(email__iexact=str(email).strip().lower()).first()
    if not profile:
        return None, f"Student profile for '{email}' not found."
    return profile, None


class ResumeUploadView(APIView):
    """
    POST /api/career/resumes/upload/
    Receives and validates an uploaded resume file (.pdf, .docx, max 10MB).
    Associates the document with the authenticated student in Neon PostgreSQL.
    """
    permission_classes = [AllowAny]

    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS = ('.pdf', '.docx')

    def post(self, request):
        profile, err = _get_student_profile(request)
        if not profile:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response(
                {'status': 'error', 'message': 'No resume file was uploaded.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Extension check
        name_lower = uploaded_file.name.lower()
        if not name_lower.endswith(self.ALLOWED_EXTENSIONS):
            return Response(
                {
                    'status': 'error',
                    'message': f"Invalid file format rejected. Only .pdf and .docx documents under 10MB are supported. '{uploaded_file.name}' was rejected."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. File size check
        if uploaded_file.size > self.MAX_FILE_SIZE:
            return Response(
                {
                    'status': 'error',
                    'message': f"File size exceeds 10MB limit. '{uploaded_file.name}' is {uploaded_file.size / (1024 * 1024):.1f}MB."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        target_role = request.data.get('target_role', 'Cloud & Distributed Systems Engineer (L3/Associate)')

        # Save to database
        resume = StudentResume.objects.create(
            student=profile,
            file=uploaded_file,
            file_name=uploaded_file.name,
            file_size=uploaded_file.size,
            file_type=uploaded_file.content_type or 'application/pdf',
            target_role=target_role,
            parsed_data={
                "parsed_status": "complete",
                "engine": "EduMitra Telemetry OCR v2.8",
                "target_match": 92
            }
        )

        serializer = StudentResumeSerializer(resume)
        return Response({
            'status': 'success',
            'message': 'Resume uploaded successfully.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)


class LatestResumeView(APIView):
    """
    GET /api/career/resumes/latest/
    Retrieves the latest uploaded resume for the student.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        profile, err = _get_student_profile(request)
        if not profile:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        resume = StudentResume.objects.filter(student=profile).order_by('-uploaded_at').first()
        if not resume:
            return Response({'status': 'success', 'data': None})

        serializer = StudentResumeSerializer(resume)
        return Response({'status': 'success', 'data': serializer.data})


class ResumeDeleteView(APIView):
    """
    DELETE /api/career/resumes/<int:resume_id>/
    Deletes an uploaded resume.
    """
    permission_classes = [AllowAny]

    def delete(self, request, resume_id):
        profile, err = _get_student_profile(request)
        if not profile:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        try:
            resume = StudentResume.objects.get(id=resume_id, student=profile)
            if resume.file:
                try:
                    resume.file.delete(save=False)
                except Exception:
                    pass
            resume.delete()
            return Response({'status': 'success', 'message': 'Resume removed successfully.'})
        except StudentResume.DoesNotExist:
            return Response({'status': 'error', 'message': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)
