from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import StudentProfile
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    StudentProfileSerializer,
    StudentProfileDetailSerializer,
    StudentProfileUpdateSerializer,
)

@api_view(['GET'])
@permission_classes([AllowAny])
def accounts_index(request):
    """Base endpoint for Accounts module."""
    return Response({
        'module': 'accounts',
        'status': 'ready',
        'message': 'EduMitra AI Accounts module is initialized.'
    })


class RegisterView(APIView):
    """
    POST /api/auth/register/
    Registers a new student account, saving records to auth_user and accounts_student_profile.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            profile = getattr(user, 'student_profile', None)
            return Response(
                {
                    'status': 'success',
                    'message': 'Student account registered successfully.',
                    'data': {
                        'userId': user.id,
                        'email': user.email,
                        'fullName': profile.full_name if profile else '',
                        'institution': profile.institution if profile else '',
                        'eduLevel': profile.education_level if profile else 'ug',
                        'createdAt': profile.created_at.isoformat() if profile else ''
                    }
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                'status': 'error',
                'message': 'Registration validation failed.',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):
    """
    POST /api/auth/login/
    Authenticates a student by email and password.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            profile = getattr(user, 'student_profile', None)
            return Response(
                {
                    'status': 'success',
                    'message': 'Login successful.',
                    'data': {
                        'userId': user.id,
                        'email': user.email,
                        'fullName': profile.full_name if profile else user.first_name,
                        'institution': profile.institution if profile else '',
                        'eduLevel': profile.education_level if profile else 'ug'
                    }
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {
                'status': 'error',
                'message': 'Login failed.',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class MeView(APIView):
    """
    GET /api/auth/me/
    Retrieves the authenticated student's profile information.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        email = request.query_params.get('email')
        if not email and request.user.is_authenticated:
            email = request.user.email

        if not email:
            return Response(
                {'status': 'error', 'message': 'Email query parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile = StudentProfile.objects.filter(email__iexact=email.strip().lower()).first()
        if not profile:
            return Response(
                {'status': 'error', 'message': 'Student profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = StudentProfileDetailSerializer(profile)
        return Response({'status': 'success', 'data': serializer.data})


class StudentProfileView(APIView):
    """
    GET /api/auth/profile/
    PATCH / PUT /api/auth/profile/
    Fetches and updates full student profile and semester GPA trajectory.
    """
    permission_classes = [AllowAny]

    def _get_target_profile(self, request):
        email = request.query_params.get('email') or request.data.get('email')
        if not email and request.user.is_authenticated:
            email = request.user.email

        if not email:
            return None, 'Email is required to identify student profile.'

        profile = StudentProfile.objects.prefetch_related('semester_records').filter(
            email__iexact=str(email).strip().lower()
        ).first()

        if not profile:
            return None, f"Student profile not found for '{email}'."

        return profile, None

    def get(self, request, *args, **kwargs):
        profile, err = self._get_target_profile(request)
        if not profile:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        serializer = StudentProfileDetailSerializer(profile)
        return Response({'status': 'success', 'data': serializer.data})

    def patch(self, request, *args, **kwargs):
        profile, err = self._get_target_profile(request)
        if not profile:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        serializer = StudentProfileUpdateSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            updated_profile = serializer.save()
            updated_profile.refresh_from_db()
            detail_serializer = StudentProfileDetailSerializer(updated_profile)
            return Response({
                'status': 'success',
                'message': 'Profile updated successfully.',
                'data': detail_serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            'status': 'error',
            'message': 'Profile update validation failed.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        return self.patch(request, *args, **kwargs)

