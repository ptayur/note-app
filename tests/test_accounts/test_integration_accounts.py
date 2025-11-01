import pytest
from rest_framework.test import APIClient
from .annotations import *

pytestmark = pytest.mark.django_db


class TestAccountsEndpoints:

    base_endpoint = "/api/v1/users/"
    endpoint_login = base_endpoint + "login/"
    endpoint_logout = base_endpoint + "logout/"
    endpoint_register = base_endpoint + "register/"
    endpoint_refresh = base_endpoint + "refresh/"
    endpoint_me = base_endpoint + "me/"

    @pytest.mark.parametrize(
        "credentials, expected_status",
        [
            pytest.param({"email": "testuser@email.com", "password": "testuser"}, 200, id="success"),
            pytest.param({"email": None, "password": "testuser"}, 400, id="no_credentials"),
            pytest.param({"email": "testuser@email.com", "password": None}, 400, id="no_credentials"),
            pytest.param({"email": "wrong@email.com", "password": "testuser"}, 401, id="wrong_credentials"),
            pytest.param({"email": "testuser@email.com", "password": "wrongpass"}, 401, id="wrong_credentials"),
        ],
    )
    def test_login(
        self,
        prepare_accounts_env: PrepareAccountsEnv,
        api_client: APIClient,
        credentials: dict[str, str | None],
        expected_status: int,
    ) -> None:
        response = api_client.post(self.endpoint_login, credentials, format="json")

        assert response.status_code == expected_status
        if expected_status == 200:
            assert response.cookies.get("refresh_token", False)
            assert response.data["access_token"]

    @pytest.mark.parametrize(
        "credentials, expected_status",
        [
            pytest.param(
                {"username": "someuser", "password": "someuser", "email": "someuser@email.com"},
                201,
                id="success",
            ),
            pytest.param(
                {"username": "testuser", "password": "testuser", "email": "someuser@email.com"},
                400,
                id="register_existing",
            ),
            pytest.param(
                {"username": "someuser", "password": "testuser", "email": "testuser@email.com"},
                400,
                id="register_existing",
            ),
            pytest.param(
                {"username": None, "password": "someuser", "email": "someuser@email.com"},
                400,
                id="no_credentials",
            ),
            pytest.param(
                {"username": "someuser", "password": None, "email": "someuser@email.com"},
                400,
                id="no_credentials",
            ),
            pytest.param(
                {"username": "someuser", "password": "someuser", "email": None},
                400,
                id="no_credentials",
            ),
        ],
    )
    def test_register(
        self,
        prepare_accounts_env: PrepareAccountsEnv,
        api_client: APIClient,
        credentials: dict[str, str | None],
        expected_status: int,
    ) -> None:
        response = api_client.post(self.endpoint_register, credentials, format="json")

        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "auth, refresh_token, expected_status",
        [
            pytest.param(True, None, 204, id="success"),
            pytest.param(True, "wrongtoken", 204, id="wrong_token"),
            pytest.param(False, None, 400, id="unauthenticated"),
        ],
    )
    def test_logout(
        self,
        prepare_accounts_env: PrepareAccountsEnv,
        api_client: APIClient,
        auth: bool,
        refresh_token: str | None,
        expected_status: int,
    ) -> None:
        if auth:
            api_client.post(self.endpoint_login, prepare_accounts_env["credentials"], format="json")
        if refresh_token:
            api_client.cookies["refresh_token"] = refresh_token

        response = api_client.post(self.endpoint_logout, format="json")

        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "auth, refresh_token, expected_status",
        [
            pytest.param(True, None, 200, id="success"),
            pytest.param(True, "wrongtoken", 401, id="wrong_token"),
            pytest.param(False, None, 400, id="unauthenticated"),
        ],
    )
    def test_refresh(
        self,
        prepare_accounts_env: PrepareAccountsEnv,
        api_client: APIClient,
        auth: bool,
        refresh_token: str | None,
        expected_status: int,
    ) -> None:
        if auth:
            login_response = api_client.post(self.endpoint_login, prepare_accounts_env["credentials"], format="json")
            old_refresh = api_client.cookies.get("refresh_token")
        if refresh_token:
            api_client.cookies["refresh_token"] = refresh_token

        response = api_client.post(self.endpoint_refresh, format="json")

        assert response.status_code == expected_status
        if expected_status == 200:
            assert old_refresh != api_client.cookies.get("refresh_token")
            assert login_response.data["access_token"] != response.data["access_token"]

    @pytest.mark.parametrize(
        "auth, expected_status",
        [
            pytest.param(True, 200, id="success"),
            pytest.param(False, 401, id="unauthenticated"),
        ],
    )
    def test_me(
        self,
        prepare_accounts_env: PrepareAccountsEnv,
        api_client: APIClient,
        auth: bool,
        expected_status: int,
    ) -> None:
        if auth:
            login_response = api_client.post(self.endpoint_login, prepare_accounts_env["credentials"], format="json")
            api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access_token']}")

        response = api_client.get(self.endpoint_me, format="json")

        assert response.status_code == expected_status
        if expected_status == 200:
            assert response.data["user"]["email"]
            assert response.data["user"]["username"]
