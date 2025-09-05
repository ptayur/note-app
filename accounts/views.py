from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.conf import settings
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser
from .serializers import CustomUserModelSerializer, LoginSerializer

##
## Authentication views
##


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
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
                {"errors": "No refresh token found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)
        except TokenError:
            return Response(
                {"errors": "Invalid refresh token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", True):
            try:
                user = CustomUser.objects.get(id=refresh["user_id"])
            except CustomUser.DoesNotExist:
                return Response({"errors": "User not found"}, status=status.HTTP_401_UNAUTHORIZED)
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
                {"errors": "No refresh token found"},
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
    authentication_classes = []

    def post(self, request):
        serializer = CustomUserModelSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(
            {"username": serializer.data["username"], "email": serializer.data["email"]},
            status=status.HTTP_201_CREATED,
        )


##
## Validation views
##


class UsernameValidationView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        username = request.query_params.get("username")
        if not username:
            return Response({"errors": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            if CustomUser.objects.filter(username=username).exists():
                return Response(
                    {"errors": "Username is already associated with an account"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response({"data": ""}, status=status.HTTP_200_OK)


class EmailValidationView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email").lower()

        if not email:
            return Response({"errors": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                validate_email(email)
            except ValidationError as error:
                return Response({"errors": error.messages}, status=status.HTTP_400_BAD_REQUEST)

            if CustomUser.objects.filter(email=email).exists():
                return Response(
                    {"errors": "Email is already associated with an account"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response({"data": ""}, status=status.HTTP_200_OK)


class PasswordValidationView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        password = request.data.get("password")

        if not password:
            return Response({"errors": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                validate_password(password=password)
            except ValidationError as error:
                return Response({"errors": error.messages}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"data": ""}, status=status.HTTP_200_OK)
