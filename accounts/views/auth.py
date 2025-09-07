from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.conf import settings
from accounts.models import CustomUser
from accounts.serializers import CustomUserModelSerializer, LoginSerializer
from config.utils.api_responses import APIResponse


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return APIResponse.error("Invalid credentials.")
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        data = {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }

        response = APIResponse.success(data)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=7 * 24 * 60 * 60,
            path="/api/users/",
        )

        return response


class RefreshView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token") or request.data.get("refresh_token")

        if refresh_token is None:
            return APIResponse.error("No refresh token found.")

        try:
            refresh = RefreshToken(refresh_token)
        except TokenError:
            return APIResponse.error(
                "Invalid refresh token", status_code=status.HTTP_401_UNAUTHORIZED
            )

        if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", True):
            try:
                user = CustomUser.objects.get(id=refresh["user_id"])
            except CustomUser.DoesNotExist:
                return APIResponse.error(
                    "User not found.", status_code=status.HTTP_401_UNAUTHORIZED
                )
            new_refresh = RefreshToken.for_user(user)

            if settings.SIMPLE_JWT.get("BLACKLIST_AFTER_ROTATION", True):
                refresh.blacklist()

            access_token = str(new_refresh.access_token)
            refresh_token = str(new_refresh)
        else:
            access_token = str(refresh.access_token)

        data = {"access_token": access_token, "refresh_token": refresh_token}
        response = APIResponse.success(data)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=7 * 24 * 60 * 60,
            path="/api/users/",
        )

        return response


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token") or request.data.get("refresh_token")

        if refresh_token is None:
            return APIResponse.error("No refresh token found.")

        try:
            refresh = RefreshToken(refresh_token)
            refresh.blacklist()
        except TokenError:
            pass

        response = APIResponse.success(status_code=status.HTTP_204_NO_CONTENT)
        response.delete_cookie("refresh_token")
        return response


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = CustomUserModelSerializer(data=request.data)
        if not serializer.is_valid():
            return APIResponse.error(serializer.errors)
        user = serializer.save()

        data = {"user": CustomUserModelSerializer(user).data}
        return APIResponse.success(data, status_code=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {"user": CustomUserModelSerializer(user).data}
        return APIResponse.success(data, status_code=status.HTTP_200_OK)
