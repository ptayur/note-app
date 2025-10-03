from rest_framework.views import APIView
from rest_framework import status, permissions
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from accounts.models import CustomUser
from config.utils.api_responses import APIResponse


class UsernameValidationView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        username = request.query_params.get("username")
        if not username:
            return APIResponse.error(
                "Username is required.", status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        else:
            if CustomUser.objects.filter(username=username).exists():
                return APIResponse.error(
                    "Username is already associated with an account.",
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                )

        return APIResponse.success(status_code=status.HTTP_204_NO_CONTENT)


class EmailValidationView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email").lower()

        if not email:
            return APIResponse.error(
                "Email is required.", status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        else:
            try:
                validate_email(email)
            except ValidationError as error:
                return APIResponse.error(
                    error.messages, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
                )
            if CustomUser.objects.filter(email=email).exists():
                return APIResponse.error(
                    "Email is already associated with an account.",
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                )

        return APIResponse.success(status_code=status.HTTP_204_NO_CONTENT)


class PasswordValidationView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        password = request.data.get("password")

        if not password:
            return APIResponse.error(
                "Password is required.", status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        else:
            try:
                validate_password(password=password)
            except ValidationError as error:
                return APIResponse.error(
                    error.messages, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
                )

        return APIResponse.success(status_code=status.HTTP_204_NO_CONTENT)
