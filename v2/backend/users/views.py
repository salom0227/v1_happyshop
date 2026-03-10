from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile
from .serializers import RegisterSerializer, LoginSerializer, ProfileSerializer

User = get_user_model()


def _get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class RegisterView(APIView):
    """POST /api/auth/register — create account. Returns JWT tokens + user."""

    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        user = ser.save()
        profile = user.profile
        tokens = _get_tokens_for_user(user)
        return Response(
            {
                "user": ProfileSerializer(profile).data,
                "tokens": tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """POST /api/auth/login — email + password. Returns JWT tokens + user."""

    def post(self, request):
        ser = LoginSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        email = ser.validated_data["email"].lower()
        password = ser.validated_data["password"]
        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response(
                {"detail": "Email yoki parol noto'g'ri."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        if not user.is_active:
            return Response(
                {"detail": "Hisob faol emas."},
                status=status.HTTP_403_FORBIDDEN,
            )
        profile = user.profile
        tokens = _get_tokens_for_user(user)
        return Response({
            "user": ProfileSerializer(profile).data,
            "tokens": tokens,
        })


class ProfileView(APIView):
    """GET /api/auth/profile — current user. PATCH — update name, phone. JWT required."""

    permission_classes = [IsAuthenticated]

    def _get_profile(self, user):
        profile, _ = Profile.objects.get_or_create(user=user)
        return profile

    def get(self, request):
        profile = self._get_profile(request.user)
        return Response(ProfileSerializer(profile).data)

    def patch(self, request):
        profile = self._get_profile(request.user)
        ser = ProfileSerializer(profile, data=request.data, partial=True)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
        ser.save()
        return Response(ProfileSerializer(profile).data)
