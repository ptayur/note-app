import pytest
from rest_framework.test import APIClient
from .annotations import *

pytestmark = pytest.mark.django_db


class TestNotesEndpoints:

    #
    # Notes List Endpoints Tests
    #

    @pytest.mark.parametrize(
        "auth_user, expected_status",
        [
            pytest.param("user1", 200, id="success"),
            pytest.param(None, 401, id="unauthenticated"),
        ],
    )
    def test_list(
        self,
        prepare_notes_env: PrepareNotesEnv,
        authenticate: Authenticate,
        get_notes_url: GetNotesUrl,
        auth_user: str | None,
        expected_status: int,
    ) -> None:
        client = authenticate(prepare_notes_env[auth_user]) if auth_user else APIClient()

        response = client.get(get_notes_url())

        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "search, ownership, role",
        [
            (["Shopping"], None, None),
            (["Shopping"], ["private"], None),
            (None, ["with_shares"], None),
            (None, None, ["viewer"]),
            (["Meeting"], ["shared"], ["editor"]),
        ],
    )
    def test_list_filters(
        self,
        authenticate: Authenticate,
        prepare_notes_env: PrepareNotesEnv,
        search: list[str] | None,
        ownership: list[str] | None,
        role: list[str] | None,
        get_notes_url: GetNotesUrl,
    ) -> None:
        client = authenticate(prepare_notes_env["user1"])
        query = []
        if search is not None:
            for s in search:
                query.append(("search", s))
        if ownership is not None:
            for o in ownership:
                query.append(("ownership", o))
        if role is not None:
            for p in role:
                query.append(("role", p))

        response = client.get(get_notes_url(), query)

        assert response.status_code == 200

    @pytest.mark.parametrize(
        "auth_user, expected_status",
        [
            pytest.param("user1", 201, id="success"),
            pytest.param(None, 401, id="unauthenticated"),
        ],
    )
    def test_create(
        self,
        prepare_notes_env: PrepareNotesEnv,
        authenticate: Authenticate,
        get_notes_url: GetNotesUrl,
        auth_user: str | None,
        expected_status: int,
    ) -> None:
        client = authenticate(prepare_notes_env[auth_user]) if auth_user else APIClient()
        payload = {
            "title": "sometitle",
            "content": "somecontent",
        }

        response = client.post(get_notes_url(), data=payload, format="json")

        assert response.status_code == expected_status

    #
    # Notes Detail Endpoints Tests
    #

    @pytest.mark.parametrize(
        "auth_user, note_id, expected_status",
        [
            pytest.param("user1", 0, 200, id="success"),
            pytest.param("user2", 0, 200, id="success"),
            pytest.param("user2", 2, 403, id="unauthorized"),
            pytest.param(None, 1, 401, id="unauthenticated"),
        ],
    )
    def test_retrieve(
        self,
        prepare_notes_env: PrepareNotesEnv,
        authenticate: Authenticate,
        get_notes_url: GetNotesUrl,
        auth_user: str | None,
        note_id: int,
        expected_status: int,
    ) -> None:
        client = authenticate(prepare_notes_env[auth_user]) if auth_user else APIClient()

        response = client.get(get_notes_url(prepare_notes_env["notes"][note_id].pk))

        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "auth_user, note_id, expected_status",
        [
            pytest.param("user1", 1, 200, id="success"),
            pytest.param("user2", 1, 200, id="success"),
            pytest.param("user2", 0, 403, id="unauthorized"),
            pytest.param(None, 0, 401, id="unauthenticated"),
        ],
    )
    def test_update(
        self,
        prepare_notes_env: PrepareNotesEnv,
        authenticate: Authenticate,
        get_notes_url: GetNotesUrl,
        auth_user: str | None,
        note_id: int,
        expected_status: int,
    ) -> None:
        client = authenticate(prepare_notes_env[auth_user]) if auth_user else APIClient()
        payload = {
            "title": "somenewtitle",
            "content": "somenewcontent",
        }

        response = client.put(get_notes_url(prepare_notes_env["notes"][note_id].pk), data=payload, format="json")

        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "auth_user, note_id, expected_status",
        [
            pytest.param("user1", 1, 200, id="success"),
            pytest.param("user2", 1, 200, id="success"),
            pytest.param("user2", 0, 403, id="unauthorized"),
            pytest.param(None, 0, 401, id="unauthenticated"),
        ],
    )
    def test_partially_update(
        self,
        prepare_notes_env: PrepareNotesEnv,
        authenticate: Authenticate,
        get_notes_url: GetNotesUrl,
        auth_user: str | None,
        note_id: int,
        expected_status: int,
    ) -> None:
        client = authenticate(prepare_notes_env[auth_user]) if auth_user else APIClient()
        payload = {
            "title": "somenewtitle",
        }

        response = client.patch(get_notes_url(prepare_notes_env["notes"][note_id].pk), data=payload, format="json")

        assert response.status_code == expected_status

    @pytest.mark.parametrize(
        "auth_user, note_id, expected_status",
        [
            pytest.param("user1", 0, 204, id="success"),
            pytest.param("user2", 1, 403, id="unauthorized"),
            pytest.param(None, 0, 401, id="unauthenticated"),
        ],
    )
    def test_delete(
        self,
        prepare_notes_env: PrepareNotesEnv,
        authenticate: Authenticate,
        get_notes_url: GetNotesUrl,
        auth_user: str | None,
        note_id: int,
        expected_status: int,
    ) -> None:
        client = authenticate(prepare_notes_env[auth_user]) if auth_user else APIClient()

        response = client.delete(get_notes_url(prepare_notes_env["notes"][note_id].pk))

        assert response.status_code == expected_status
