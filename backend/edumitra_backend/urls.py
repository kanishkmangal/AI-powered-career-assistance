"""
EduMitra AI - Backend URL Configuration
Root routing for all API endpoints.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from apps.accounts.views import RegisterView, LoginView, MeView, StudentProfileView, ChangePasswordView

@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    """
    Basic backend health-check API endpoint.
    GET /api/health/
    """
    return Response({
        "status": "success",
        "message": "EduMitra AI Backend is running"
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check and API overview endpoint.
    """
    return Response({
        'status': 'healthy',
        'platform': 'EduMitra AI API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health/',
            'register': '/api/auth/register/',
            'login': '/api/auth/login/',
            'accounts': '/api/accounts/',
            'academics': '/api/academics/',
            'career': '/api/career/',
            'notifications': '/api/notifications/',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', health_check, name='api-overview'),
    path('api/health/', health, name='api-health'),
    # Canonical Auth endpoints
    path('api/auth/register/', RegisterView.as_view(), name='auth-register'),
    path('api/auth/login/', LoginView.as_view(), name='auth-login'),
    path('api/auth/me/', MeView.as_view(), name='auth-me'),
    path('api/auth/profile/', StudentProfileView.as_view(), name='auth-profile'),
    path('api/auth/change-password/', ChangePasswordView.as_view(), name='auth-change-password'),
    # App modules
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/academics/', include('apps.academics.urls')),
    path('api/career/', include('apps.career.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
]
