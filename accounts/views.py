from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.conf import settings
from .models import CustomUser
from .serializers import CustomUserModelSerializer, LoginSerializer


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response(
            {"access_token": access_token, "refresh_token": refresh_token},
            status=status.HTTP_200_OK,
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=7 * 24 * 60 * 60,
            path="/auth/refresh/",
        )
        return response


class RefreshView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token") or request.data.get("refresh_token")

        if refresh_token is None:
            return Response(
                {"detail": "No refresh token found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)
        except TokenError:
            return Response(
                {"detail": "Invalid refresh token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", True):
            try:
                user = CustomUser.objects.get(id=refresh["user_id"])
            except CustomUser.DoesNotExist:
                return Response({"detail": "User not found"}, status=status.HTTP_401_UNAUTHORIZED)
            new_refresh = RefreshToken.for_user(user)

            if settings.SIMPLE_JWT.get("BLACKLIST_AFTER_ROTATION", True):
                refresh.blacklist()

            access_token = str(new_refresh.access_token)
            refresh_token = str(new_refresh)
        else:
            access_token = str(refresh.access_token)

        data = {"access_token": access_token, "refresh_token": refresh_token}
        response = Response(data, status=status.HTTP_200_OK)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=7 * 24 * 60 * 60,
            path="/auth/refresh/",
        )

        return response


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token") or request.data.get("refresh_token")

        if refresh_token is None:
            return Response(
                {"detail": "No refresh token found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)
            refresh.blacklist()
        except TokenError:
            pass

        response = Response(status=status.HTTP_205_RESET_CONTENT)
        response.delete_cookie("refresh_token")
        return response


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CustomUserModelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"username": serializer.data["username"], "email": serializer.data["email"]},
            status=status.HTTP_201_CREATED,
        )
