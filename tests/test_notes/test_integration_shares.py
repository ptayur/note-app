import pytest
from .annotations import *

pytestmark = pytest.mark.django_db


class TestSharesEndpoints:

    def test_create(
        self,
        prepare_notes: PrepareNotes,
        authenticate: Authenticate,
        get_shares_url: GetSharesUrl,
    ) -> None:
        client = authenticate(prepare_notes["user1"])
        payload = {
            "user": prepare_notes["user2"].username,
            "permissions": ["read"],
        }
        note = prepare_notes["notes"][2]

        response = client.post(get_shares_url(note_pk=note.pk), payload, format="json")

        assert response.status_code == 201

    def test_get_list(
        self,
        prepare_notes: PrepareNotes,
        authenticate: Authenticate,
        get_shares_url: GetSharesUrl,
    ) -> None:
        client = authenticate(prepare_notes["user1"])
        note = prepare_notes["notes"][0]

        response = client.get(get_shares_url(note_pk=note.pk), format="json")

        assert response.status_code == 200
        assert len(response.data) == 1

    def test_unauthorized_create(
        self,
        prepare_notes: PrepareNotes,
        authenticate: Authenticate,
        get_shares_url: GetSharesUrl,
    ) -> None:
        client = authenticate(prepare_notes["user2"])
        payload = {
            "user": prepare_notes["user2"].username,
            "permissions": ["read"],
        }
        note = prepare_notes["notes"][0]

        response = client.post(get_shares_url(note_pk=note.pk), payload, format="json")

        assert response.status_code == 403

    def test_unauthorized_list(
        self,
        prepare_notes: PrepareNotes,
        authenticate: Authenticate,
        get_shares_url: GetSharesUrl,
    ) -> None:
        client = authenticate(prepare_notes["user2"])
        note = prepare_notes["notes"][0]

        response = client.get(get_shares_url(note_pk=note.pk), format="json")

        assert response.status_code == 403

    def test_get(
        self,
        prepare_notes: PrepareNotes,
        authenticate: Authenticate,
        get_shares_url: GetSharesUrl,
    ) -> None:
        client = authenticate(prepare_notes["user1"])
        share = prepare_notes["shares"][0]

        response = client.get(get_shares_url(pk=share.pk), format="json")

        assert response.status_code == 200

    def test_partially_update(
        self,
        prepare_notes: PrepareNotes,
        authenticate: Authenticate,
        get_shares_url: GetSharesUrl,
    ) -> None:
        client = authenticate(prepare_notes["user1"])
        payload = {"permissions": ["read", "write"]}
        share = prepare_notes["shares"][0]

        response = client.patch(get_shares_url(pk=share.pk), payload, format="json")

        assert response.status_code == 200

    def test_delete(
        self,
        prepare_notes: PrepareNotes,
        authenticate: Authenticate,
        get_shares_url: GetSharesUrl,
    ) -> None:
        client = authenticate(prepare_notes["user1"])
        share = prepare_notes["shares"][0]

        response = client.delete(get_shares_url(pk=share.pk), format="json")

        assert response.status_code == 204
