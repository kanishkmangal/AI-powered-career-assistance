from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework import exceptions
from django.contrib.auth.models import User
from .tokens import verify_auth_token


class EduMitraTokenAuthentication(BaseAuthentication):
    """
    EduMitraTokenAuthentication
    DRF authentication class that validates Bearer tokens signed by create_auth_token().
    Rejects expired or tampered tokens with HTTP 401 AuthenticationFailed.
    """

    def authenticate(self, request):
        auth_header = get_authorization_header(request).decode('utf-8')
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2:
            return None

        prefix = parts[0].lower()
        if prefix not in ('bearer', 'token'):
            return None

        raw_token = parts[1]
        payload, err = verify_auth_token(raw_token)
        if err:
            raise exceptions.AuthenticationFailed(err)

        user_id = payload.get('user_id')
        user = User.objects.filter(id=user_id, is_active=True).first()
        if not user:
            raise exceptions.AuthenticationFailed('User account does not exist or has been deactivated.')

        return (user, raw_token)

    def authenticate_header(self, request):
        return 'Bearer realm="api"'
