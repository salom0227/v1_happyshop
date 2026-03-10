"""Allow login with email (and password) instead of username."""
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailAuthBackend:
    """Authenticate by email."""

    def authenticate(self, request, username=None, password=None, **kwargs):
        email = username or kwargs.get("email")
        if not email or not password:
            return None
        try:
            user = User.objects.get(email__iexact=email)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
