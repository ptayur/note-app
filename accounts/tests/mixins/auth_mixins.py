from rest_framework.response import Response
from rest_framework.test import APIClient
from django.urls import reverse


class AuthActionsTestMixin:
    """
    Mixin for tests on authentication actions.

    Provides basic methods for requests to authentication endpoints.
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.auth_routes = {
            "login": reverse("login"),
            "register": reverse("register"),
            "logout": reverse("logout"),
            "refresh": reverse("refresh"),
            "me": reverse("me"),
        }

    def login(self, credentials: dict[str, str]) -> Response:
        """
        Makes POST request to login endpoint with `credentials`.

        Returns `Response`.
        """
        return self.client.post(self.auth_routes["login"], credentials, format="json")

    def register(self, data: dict[str, str]) -> Response:
        """
        Makes POST request to register endpoint with `data`.

        Returns `Response`.
        """
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


class AuthTestMixin:
    """
    Mixin for authentication tests.

    Provides basic methods for requests to endpoints.
    """

    def authenticate(self, credentials: dict[str, str]) -> APIClient:
        """
        Sets authentication state for user with provided `credentials`.

        Returns tuple of `APIClient` object with `refresh_token` in cookies
        and `access_token` in Authorization header.
        """
        response = self.client.post(reverse("login"), credentials, format="json")
        client = APIClient()
        self.access_token = response.data["access_token"]
        self.refresh_token = response.cookies.get("refresh_token").value
        client.cookies["refresh_token"] = self.refresh_token
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        return client
