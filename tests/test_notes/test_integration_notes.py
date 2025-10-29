import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from notes.models import Note
from .annotations import *

pytestmark = pytest.mark.django_db


class TestNotesEndpoints:

    def test_list(self, prepare_notes: PrepareNotes, authenticate: Authenticate, get_notes_url: GetNotesUrl) -> None:
        client = authenticate(prepare_notes["user1"])

        response = client.get(get_notes_url())

        assert response.status_code == 200
        assert len(response.data) == 4

    @pytest.mark.parametrize(
        "search, ownership, permissions",
        [
            (["Shopping"], None, None),
            (["Shopping"], ["private"], None),
            (None, ["with_shares"], None),
            (None, None, ["read"]),
            (["Meeting"], ["shared"], ["write"]),
        ],
    )
    def test_list_filters(
        self,
        authenticate: Authenticate,
        prepare_notes: PrepareNotes,
        search: list[str] | None,
        ownership: list[str] | None,
        permissions: list[str] | None,
        get_notes_url: GetNotesUrl,
    ) -> None:
        client = authenticate(prepare_notes["user1"])
        query = []
        if search is not None:
            for s in search:
                query.append(("search", s))
        if ownership is not None:
            for o in ownership:
                query.append(("ownership", o))
        if permissions is not None:
            for p in permissions:
                query.append(("permissions", p))

        response = client.get(get_notes_url(), query, format="json")

        assert response.status_code == 200

    def test_create(self, user_factory: UserFactory, authenticate: Authenticate, get_notes_url: GetNotesUrl) -> None:
        user = user_factory()
        client = authenticate(user)
        note = baker.prepare(Note, owner=user)
        payload = {
            "title": note.title,
            "content": note.content,
        }

        response = client.post(get_notes_url(), data=payload, format="json")

        assert response.status_code == 201
        assert response.data["title"] == payload["title"]
        assert response.data["content"] == payload["content"]
        assert response.data["owner"] == user.username
        assert "url" in response.data
        assert "id" in response.data
        assert "created_at" in response.data
        assert "updated_at" in response.data
        assert "shares" in response.data

    def test_retrieve(
        self,
        user_factory: UserFactory,
        note_factory: NoteFactory,
        authenticate: Authenticate,
        get_notes_url: GetNotesUrl,
    ) -> None:
        user = user_factory()
        client = authenticate(user)
        note = note_factory(owner=user)
        note_url = get_notes_url(note.pk)
        expected_json = {
            "url": f"http://testserver{note_url}",
            "id": note.pk,
            "owner": user.username,
            "title": note.title,
            "content": note.content,
            "created_at": note.created_at.isoformat().replace("+00:00", "Z"),
            "updated_at": note.updated_at.isoformat().replace("+00:00", "Z"),
            "shares": [],
        }

        response = client.get(note_url)

        assert response.status_code == 200
        assert response.data == expected_json

    def test_update(
        self,
        user_factory: UserFactory,
        note_factory: NoteFactory,
        authenticate: Authenticate,
        get_notes_url: GetNotesUrl,
    ) -> None:
        user = user_factory()
        client = authenticate(user)
        old_note = note_factory(owner=user)
        new_note = baker.prepare(Note, owner=user)
        payload = {
            "title": new_note.title,
            "content": new_note.content,
        }

        response = client.put(get_notes_url(old_note.pk), data=payload, format="json")

        assert response.status_code == 200
        assert response.data["title"] == payload["title"]
        assert response.data["content"] == payload["content"]

    @pytest.mark.parametrize("field", ["title", "content"])
    def test_partially_update(
        self,
        field: str,
        user_factory: UserFactory,
        note_factory: NoteFactory,
        authenticate: Authenticate,
        get_notes_url: GetNotesUrl,
    ) -> None:
        user = user_factory()
        client = authenticate(user)
        note = note_factory(owner=user)
        note_data = baker.prepare(Note, owner=user)
        payload = {field: getattr(note_data, field)}

        response = client.patch(get_notes_url(note.pk), data=payload, format="json")

        assert response.status_code == 200
        assert response.data[field] == payload[field]

    def test_delete(
        self,
        user_factory: UserFactory,
        note_factory: NoteFactory,
        authenticate: Authenticate,
        get_notes_url: GetNotesUrl,
    ) -> None:
        user = user_factory()
        client = authenticate(user)
        note = note_factory(owner=user)

        response = client.delete(get_notes_url(note.pk))

        assert response.status_code == 204

    @pytest.mark.parametrize(
        "method",
        [
            ("get"),
            ("put"),
            ("patch"),
            ("delete"),
        ],
    )
    def test_unauthorized_access(
        self, prepare_notes: PrepareNotes, authenticate: Authenticate, get_notes_url: GetNotesUrl, method: str
    ) -> None:
        client = authenticate(prepare_notes["user2"])
        note = prepare_notes["notes"][2]

        response = getattr(client, method)(get_notes_url(note.pk), format="json")

        assert response.status_code == 403

    @pytest.mark.parametrize(
        "method",
        [
            ("get"),
            ("post"),
            ("put"),
            ("patch"),
            ("delete"),
        ],
    )
    def test_unauthenticated_access(
        self,
        prepare_notes: PrepareNotes,
        api_client: APIClient,
        get_notes_url: GetNotesUrl,
        method: str,
    ):
        note = prepare_notes["notes"][0]
        url = get_notes_url(note.pk)
        if method in ["post"]:
            url = get_notes_url()

        response = getattr(api_client, method)(url, format="json")

        assert response.status_code == 401
