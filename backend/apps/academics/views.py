from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def academics_index(request):
    """Base endpoint for Academics & Learning module."""
    return Response({
        'module': 'academics',
        'status': 'ready',
        'message': 'EduMitra AI Academics module is initialized.'
    })

