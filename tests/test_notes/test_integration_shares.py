import pytest
from rest_framework.test import APIClient
from .annotations import *

pytestmark = pytest.mark.django_db


class TestSharesEndpoints:

    #
    # Share List Endpoint Tests
    #

    @pytest.mark.parametrize(
        "auth_user, grant_to_user, expected_status",
        [
            pytest.param("owner", "user_norights", 201, id="success"),
            pytest.param("owner", "owner", 400, id="self_share"),
            pytest.param("owner", "user_read", 400, id="existing_share"),
            pytest.param("user_norights", "user_norights", 403, id="unauthorized"),
            pytest.param(None, "user_norights", 401, id="unauthenticated"),
        ],
    )
    def test_create(
        self,
        prepare_shares_env: PrepareSharesEnv,
        authenticate: Authenticate,
        get_shares_url: GetSharesUrl,
        auth_user: str | None,
        grant_to_user: str,
        expected_status: int,
    ) -> None:
        client = authenticate(prepare_shares_env[auth_user]) if auth_user else APIClient()
        payload = {
            "user": prepare_shares_env[grant_to_user].username,
            "permissions": ["read"],
        }
        note = prepare_shares_env["note"]

        response = client.post(get_shares_url(note_pk=note.pk), payload, format="json")

        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "auth_user, expected_status",
        [
            pytest.param("owner", 200, id="success"),
            pytest.param("user_norights", 403, id="unauthorized"),
            pytest.param(None, 401, id="unauthenticated"),
        ],
    )
    def test_get_list(
        self,
        prepare_shares_env: PrepareSharesEnv,
        authenticate: Authenticate,
        get_shares_url: GetSharesUrl,
        auth_user,
        expected_status,
    ) -> None:
        client = authenticate(prepare_shares_env[auth_user]) if auth_user else APIClient()
        note = prepare_shares_env["note"]

        response = client.get(get_shares_url(note_pk=note.pk), format="json")

        assert response.status_code == expected_status

    #
    # Share Detail Endpoint Tests
    #

    @pytest.mark.parametrize(
        "auth_user, expected_status",
        [
            pytest.param("owner", 200, id="success"),
            pytest.param("user_norights", 403, id="unauthorized"),
            pytest.param(None, 401, id="unauthenticated"),
        ],
    )
    def test_get(
        self,
        prepare_shares_env: PrepareSharesEnv,
        authenticate: Authenticate,
        get_shares_url: GetSharesUrl,
        auth_user: str | None,
        expected_status: int,
    ) -> None:
        client = authenticate(prepare_shares_env[auth_user]) if auth_user else APIClient()
        share = prepare_shares_env["share"]
        note = prepare_shares_env["note"]

        response = client.get(get_shares_url(note_pk=note.pk, pk=share.pk), format="json")

        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "auth_user, expected_status",
        [
            pytest.param("owner", 200, id="success"),
            pytest.param("user_norights", 403, id="unauthorized"),
            pytest.param(None, 401, id="unauthenticated"),
        ],
    )
    def test_partially_update(
        self,
        prepare_shares_env: PrepareSharesEnv,
        authenticate: Authenticate,
        get_shares_url: GetSharesUrl,
        auth_user: str | None,
        expected_status: int,
    ) -> None:
        client = authenticate(prepare_shares_env[auth_user]) if auth_user else APIClient()
        payload = {"permissions": ["read", "write"]}
        share = prepare_shares_env["share"]
        note = prepare_shares_env["note"]

        response = client.patch(get_shares_url(note_pk=note.pk, pk=share.pk), payload, format="json")

        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "auth_user, expected_status",
        [
            pytest.param("owner", 204, id="success"),
            pytest.param("user_norights", 403, id="unauthorized"),
            pytest.param(None, 401, id="unauthenticated"),
        ],
    )
    def test_delete(
        self,
        prepare_shares_env: PrepareSharesEnv,
        authenticate: Authenticate,
        get_shares_url: GetSharesUrl,
        auth_user: str | None,
        expected_status: int,
    ) -> None:
        client = authenticate(prepare_shares_env[auth_user]) if auth_user else APIClient()
        share = prepare_shares_env["share"]
        note = prepare_shares_env["note"]

        response = client.delete(get_shares_url(note_pk=note.pk, pk=share.pk), format="json")

        assert response.status_code == expected_status
