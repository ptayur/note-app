from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password
from accounts.models import CustomUser


class UsernameValidationView(APIView):
    """
    Username validation view for `/api/users/validate-username/` endpoint.

    Supports `GET` method.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        username = request.query_params.get("username")
        if not username:
            raise ValidationError("Username is required.", code=status.HTTP_422_UNPROCESSABLE_ENTITY)
        if CustomUser.objects.filter(username=username).exists():
            raise ValidationError(
                "Username is already associated with an account.", code=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        return Response(status_code=status.HTTP_204_NO_CONTENT)


class EmailValidationView(APIView):
    """
    Email validation view for `/api/users/validate-email/` endpoint.

    Supports `POST` method.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email").lower()
        if not email:
            raise ValidationError("Email is required.", code=status.HTTP_422_UNPROCESSABLE_ENTITY)

        try:
            validate_email(email)
        except DjangoValidationError as error:
            raise ValidationError(error.messages, code=status.HTTP_422_UNPROCESSABLE_ENTITY)

        if CustomUser.objects.filter(email=email).exists():
            raise ValidationError(
                "Email is already associated with an account.", code=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        return Response(status_code=status.HTTP_204_NO_CONTENT)


class PasswordValidationView(APIView):
    """
    Password validation view for `/api/users/validate-password/` endpoint.

    Supports `POST` method.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        password = request.data.get("password")
        if not password:
            raise ValidationError("Password is required.", code=status.HTTP_422_UNPROCESSABLE_ENTITY)

        try:
            validate_password(password=password)
        except DjangoValidationError as error:
            raise ValidationError(error.messages, code=status.HTTP_422_UNPROCESSABLE_ENTITY)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
