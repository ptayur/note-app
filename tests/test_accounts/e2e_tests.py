import pytest
from rest_framework.test import APIClient
from .annotations import *

pytestmark = pytest.mark.django_db


class TestAccountsEndpoints:

    endpoint_login = "/api/users/login/"
    endpoint_logout = "/api/users/logout/"
    endpoint_register = "/api/users/register/"
    endpoint_refresh = "/api/users/refresh/"
    endpoint_me = "/api/users/me/"

    def test_login(self, registered_user: RegisteredUser, api_client: APIClient) -> None:
        response = api_client.post(self.endpoint_login, registered_user["credentials"], format="json")

        assert response.status_code == 200
        assert response.cookies.get("refresh_token", False)
        assert response.data["access_token"]

    def test_register(self, user_data: dict[str, str], api_client: APIClient) -> None:
        response = api_client.post(self.endpoint_register, user_data, format="json")

        assert response.status_code == 201

    def test_logout(self, registered_user: RegisteredUser, api_client: APIClient) -> None:
        api_client.post(self.endpoint_login, registered_user["credentials"], format="json")

        response = api_client.post(self.endpoint_logout, format="json")

        assert response.status_code == 204

    def test_refresh(self, registered_user: RegisteredUser, api_client: APIClient) -> None:
        login_response = api_client.post(self.endpoint_login, registered_user["credentials"], format="json")
        old_refresh = api_client.cookies.get("refresh_token")

        response = api_client.post(self.endpoint_refresh, format="json")

        assert response.status_code == 200
        assert old_refresh != api_client.cookies.get("refresh_token")
        assert login_response.data["access_token"] != response.data["access_token"]

    def test_me(self, registered_user: RegisteredUser, api_client: APIClient) -> None:
        login_response = api_client.post(self.endpoint_login, registered_user["credentials"], format="json")
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access_token']}")

        response = api_client.get(self.endpoint_me, format="json")

        assert response.status_code == 200
        assert response.data["user"]["email"]
        assert response.data["user"]["username"]
