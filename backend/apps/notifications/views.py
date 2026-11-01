from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def notifications_index(request):
    """Base endpoint for Notifications & Activity Center module."""
    return Response({
        'module': 'notifications',
        'status': 'ready',
        'message': 'EduMitra AI Notifications module is initialized.'
    })

