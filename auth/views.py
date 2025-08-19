from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .serializers import RegisterSerializer, LoginSerializer

# Create your views here.


class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response(
            {"access_token": access_token}, status=status.HTTP_200_OK
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=7 * 24 * 60 * 60,
        )
        return response


class RefreshView(APIView):

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token is None:
            return Response(
                {"message": "No refresh token found."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)
        except TokenError:
            return Response(
                {"message": "Invalid refresh token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        access_token = str(refresh.access_token)

        new_refresh_token = None
        if hasattr(refresh, "rotate"):
            new_refresh_token = str(refresh)

        response = Response(
            {"access_token": access_token}, status=status.HTTP_200_OK
        )
        if new_refresh_token:
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite="Strict",
                max_age=7 * 24 * 60 * 60,
            )
        return response


class LogoutView(APIView):

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token is None:
            return Response(
                {"message": "No refresh token found."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        response = Response(status=status.HTTP_205_RESET_CONTENT)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            pass

        response.delete_cookie("refresh_token")
        return response


class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
