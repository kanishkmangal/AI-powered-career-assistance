from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def career_index(request):
    """Base endpoint for Career Guidance & Pathways module."""
    return Response({
        'module': 'career',
        'status': 'ready',
        'message': 'EduMitra AI Career module is initialized.'
    })

