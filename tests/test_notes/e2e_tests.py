import pytest
from model_bakery import baker
from notes.models import Note

pytestmark = pytest.mark.django_db


class TestNotesEndpoints:

    endpoint = "/api/notes/"

    def test_list(self, prepare_notes, authenticate):
        client = authenticate(prepare_notes["user1"])

        response = client.get(self.endpoint)

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
    def test_list_filters(self, authenticate, prepare_notes, search, ownership, permissions):
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

        response = client.get(self.endpoint, query, format="json")

        assert response.status_code == 200

    def test_create(self, user_factory, authenticate):
        user = user_factory()
        client = authenticate(user)
        note = baker.prepare(Note, owner=user)
        payload = {
            "title": note.title,
            "content": note.content,
        }

        response = client.post(self.endpoint, data=payload, format="json")

        assert response.status_code == 201
        assert response.data["title"] == payload["title"]
        assert response.data["content"] == payload["content"]
        assert response.data["owner"] == user.username
        assert "url" in response.data
        assert "id" in response.data
        assert "created_at" in response.data
        assert "updated_at" in response.data
        assert "shares" in response.data

    def test_retrieve(self, user_factory, authenticate):
        user = user_factory()
        client = authenticate(user)
        note = baker.make(Note, owner=user)
        expected_json = {
            "url": f"http://testserver{self.endpoint}{note.id}/",
            "id": note.id,
            "owner": user.username,
            "title": note.title,
            "content": note.content,
            "created_at": note.created_at.isoformat().replace("+00:00", "Z"),
            "updated_at": note.updated_at.isoformat().replace("+00:00", "Z"),
            "shares": [],
        }

        url = f"{self.endpoint}{note.id}/"
        response = client.get(url)

        assert response.status_code == 200
        assert response.data == expected_json

    def test_update(self, user_factory, authenticate):
        user = user_factory()
        client = authenticate(user)
        old_note = baker.make(Note, owner=user)
        new_note = baker.prepare(Note, owner=user)
        payload = {
            "title": new_note.title,
            "content": new_note.content,
        }

        url = f"{self.endpoint}{old_note.id}/"
        response = client.put(url, data=payload, format="json")

        assert response.status_code == 200
        assert response.data["title"] == payload["title"]
        assert response.data["content"] == payload["content"]
        assert response.data["created_at"] == old_note.created_at.isoformat().replace("+00:00", "Z")
        assert response.data["updated_at"] != old_note.updated_at.isoformat().replace("+00:00", "Z")

    @pytest.mark.parametrize("field", ["title", "content"])
    def test_partially_update(self, field, user_factory, authenticate):
        user = user_factory()
        client = authenticate(user)
        note = baker.make(Note, owner=user)
        note_data = baker.prepare(Note, owner=user)
        payload = {field: getattr(note_data, field)}

        url = f"{self.endpoint}{note.id}/"
        response = client.patch(url, data=payload, format="json")

        assert response.status_code == 200
        assert response.data[field] == payload[field]
        assert response.data["created_at"] == note.created_at.isoformat().replace("+00:00", "Z")
        assert response.data["updated_at"] != note.updated_at.isoformat().replace("+00:00", "Z")

    def test_delete(self, user_factory, authenticate):
        user = user_factory()
        client = authenticate(user)
        note = baker.make(Note, owner=user)

        url = f"{self.endpoint}{note.id}/"
        response = client.delete(url)

        assert response.status_code == 204
        assert Note.objects.all().count() == 0
