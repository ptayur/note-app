from rest_framework.response import Response
from django.urls import reverse


class AuthTestMixin:
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.testuser_data = {
            "username": "testuser",
            "email": "testuser@email.com",
            "password": "testuser",
        }
        cls.auth_routes = {
            "login": reverse("login"),
            "register": reverse("register"),
            "logout": reverse("logout"),
            "refresh": reverse("refresh"),
            "me": reverse("me"),
        }

    def login(self, email: str = None, password: str = None) -> Response:
        email = email or self.testuser_data["email"]
        password = password or self.testuser_data["password"]
        return self.client.post(self.auth_routes["login"], {"email": email, "password": password}, format="json")

    def register(self, username: str = None, email: str = None, password: str = None) -> Response:
        username = username or self.testuser_data["username"]
        email = email or self.testuser_data["email"]
        password = password or self.testuser_data["password"]
        return self.client.post(
            self.auth_routes["register"], {"username": username, "email": email, "password": password}, format="json"
        )

    def logout(self, refresh_token: str = None) -> Response:
        data = {}
        if refresh_token:
            data["refresh_token"] = refresh_token
        return self.client.post(self.auth_routes["logout"], data, format="json")

    def refresh(self, refresh_token: str = None) -> Response:
        data = {}
        if refresh_token:
            data["refresh_token"] = refresh_token
        return self.client.post(self.auth_routes["refresh"], data, format="json")
