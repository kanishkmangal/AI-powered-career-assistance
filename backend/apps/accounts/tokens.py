import time
from datetime import datetime, timezone, timedelta
from django.core.signing import dumps, loads, SignatureExpired, BadSignature
from django.conf import settings

# Strict durations:
# Remember Me = True: exactly 4 days (96 hours = 345,600 seconds)
REMEMBER_ME_DURATION_SECONDS = 4 * 24 * 3600  # 345,600 seconds
# Remember Me = False: standard session duration (24 hours = 86,400 seconds)
STANDARD_DURATION_SECONDS = 24 * 3600  # 86,400 seconds

TOKEN_SALT = 'edumitra.auth.token.v1'


def create_auth_token(user, remember_me=False):
    """
    Creates a cryptographically signed authentication token with embedded timestamp.
    Enforces a strict, fixed expiration:
    - 4 days (96 hours) when remember_me is True.
    - 24 hours when remember_me is False.
    The timestamp is fixed at creation and is not extended on API calls.
    """
    now_utc = datetime.now(timezone.utc)
    duration_seconds = REMEMBER_ME_DURATION_SECONDS if remember_me else STANDARD_DURATION_SECONDS
    expires_at = now_utc + timedelta(seconds=duration_seconds)

    payload = {
        'user_id': user.id,
        'email': user.email,
        'remember_me': bool(remember_me),
        'iat': int(now_utc.timestamp()),
        'exp': int(expires_at.timestamp()),
    }

    # dumps cryptographically signs the payload with timestamp using SECRET_KEY and salt
    token = dumps(payload, salt=TOKEN_SALT)
    return token, expires_at, duration_seconds


def verify_auth_token(token):
    """
    Verifies the cryptographic signature and timestamp of the token.
    Enforces that:
    1. The token signature is valid and untampered.
    2. The token age has not exceeded the allowed lifetime (4 days for remember_me, 24h otherwise).
    3. The expiration is fixed from issuance time and never extended on API requests.

    Returns:
        (payload, None) on success.
        (None, error_message) on failure.
    """
    if not token or not isinstance(token, str):
        return None, 'No authentication token provided.'

    token_str = token.strip()
    if token_str.startswith('Bearer '):
        token_str = token_str[7:].strip()
    elif token_str.startswith('Token '):
        token_str = token_str[6:].strip()

    if not token_str:
        return None, 'Authentication token is empty.'

    try:
        # Step 1: Decode payload to read metadata
        payload = loads(token_str, salt=TOKEN_SALT)
    except SignatureExpired:
        return None, 'Authentication token has expired. Please sign in again.'
    except BadSignature:
        return None, 'Invalid authentication token signature.'
    except Exception as exc:
        return None, f'Invalid token format: {str(exc)}'

    # Step 2: Determine maximum allowed age based on the remember_me flag embedded in token
    remember_me = payload.get('remember_me', False)
    max_age_seconds = REMEMBER_ME_DURATION_SECONDS if remember_me else STANDARD_DURATION_SECONDS

    # Step 3: Validate with max_age check on the signature timestamp
    try:
        loads(token_str, salt=TOKEN_SALT, max_age=max_age_seconds)
    except SignatureExpired:
        return None, 'Authentication token has expired. Please sign in again.'
    except BadSignature:
        return None, 'Invalid authentication token signature.'

    # Step 4: Strict comparison against UTC timestamp inside payload
    now_ts = int(datetime.now(timezone.utc).timestamp())
    exp_ts = payload.get('exp')
    if exp_ts and now_ts >= exp_ts:
        return None, 'Authentication token has expired. Please sign in again.'

    return payload, None
