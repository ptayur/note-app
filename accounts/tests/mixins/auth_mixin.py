from rest_framework.response import Response
from django.urls import reverse
from accounts.models import CustomUser


class AuthTestMixin:
    """
    Mixin for authentication tests.

    Provides basic methods for requests to endpoints
    and user's setup.

    By default creates `testuser`. Can be prevented using `create_testuser = False`.
    """

    create_testuser = True

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        cls.testuser_data = {
            "username": "testuser",
            "email": "testuser@email.com",
            "password": "testuser",
        }
        if getattr(cls, "create_testuser", True):
            cls.testuser = CustomUser.objects.create_user(**cls.testuser_data)

        cls.auth_routes = {
            "login": reverse("login"),
            "register": reverse("register"),
            "logout": reverse("logout"),
            "refresh": reverse("refresh"),
            "me": reverse("me"),
        }

    def authenticate(self, **kwargs) -> None:
        """
        Sets authentication state for user with `testuser_data`
        or one provided in `**kwargs`.

        Stores tokens in class members and configures client
        with Authorization header.
        """
        response = self.login(**kwargs)
        self.access_token = response.data["access_token"]
        self.refresh_token = response.cookies.get("refresh_token").value
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

    def login(self, **kwargs) -> Response:
        """
        Makes POST request to login endpoint with default `testuser_data`
        or provided credentials in `**kwargs`.

        Returns `Response`.
        """
        data = {
            "email": kwargs.get("email", self.testuser_data["email"]),
            "password": kwargs.get("password", self.testuser_data["password"]),
        }
        return self.client.post(self.auth_routes["login"], data, format="json")

    def register(self, **kwargs) -> Response:
        """
        Makes POST request to register endpoint with default `testuser_data`
        or provided data in `**kwargs`.

        Returns `Response`.
        """
        data = {**self.testuser_data, **kwargs}
        return self.client.post(self.auth_routes["register"], data, format="json")

    def logout(self, refresh_token: str | None = None) -> Response:
        """
        Makes POST request to logout endpoint.

        If `refresh_token` is provided, it will be sent in request body.

        Returns `Response`.
        """
        data = {}
        if refresh_token:
            data["refresh_token"] = refresh_token
        return self.client.post(self.auth_routes["logout"], data, format="json")

    def refresh(self, refresh_token: str | None = None) -> Response:
        """
        Makes POST request to refresh endpoint.

        If `refresh_token` is provided, it will be sent in request body.

        Returns `Response`.
        """
        data = {}
        if refresh_token:
            data["refresh_token"] = refresh_token
        return self.client.post(self.auth_routes["refresh"], data, format="json")
