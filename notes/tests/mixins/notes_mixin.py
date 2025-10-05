from rest_framework.response import Response
from django.urls import reverse
from notes.models import Note
from accounts.tests.mixins import AuthTestMixin


class NotesTestMixin(AuthTestMixin):
    """
    Mixin for notes tests.

    Provides basic methods for requests to endpoints
    and notes setup.

    By default creates 5 notes in `notes_data`.
    Can be prevented using `create_notes = False`.
    """

    create_notes = True

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.notes_data = [
            {
                "owner": cls.testuser,
                "title": f"title{i}",
                "content": f"content{i}",
            }
            for i in range(5)
        ]
        if getattr(cls, "create_notes", True):
            cls.notes = [Note.objects.create(**note_data) for note_data in cls.notes_data]

        cls.notes_routes = {
            "notes-list": reverse("notes-list"),
            "notes-detail": "notes-detail",
        }

    def _get_note_url(self, pk):
        """
        Forms note's resource URL with provided `pk`.

        Returns URL string of format `/notes/<int:pk>/`.
        """
        return reverse(self.notes_routes["notes-detail"], kwargs={"pk": pk})

    def read_notes_list(self) -> Response:
        """
        Makes `GET` request to `notes-list` endpoint.

        Returns `Response`.
        """
        return self.client.get(self.notes_routes["notes-list"], format="json")

    def create_note(self, **kwargs) -> Response:
        """
        Makes `POST` request to `notes-list` endpoint.

        Returns `Response`.
        """
        data = {**self.notes_data[0], **kwargs}
        return self.client.post(self.notes_routes["notes-list"], data, format="json")

    def read_note(self, pk: int) -> Response:
        """
        Makes `GET` request to `notes-detail` endpoint.

        Returns `Response`.
        """
        url = self._get_note_url(pk)
        return self.client.get(url, format="json")

    def delete_note(self, pk: int) -> Response:
        """
        Makes `DELETE` request to `notes-detail` endpoint.

        Returns `Response`.
        """
        url = self._get_note_url(pk)
        return self.client.delete(url, format="json")

    def update_note(self, pk: int, data: dict[str, str]) -> Response:
        """
        Makes `PATCH` request to `notes-detail` endpoint.

        Returns `Response`.
        """
        url = self._get_note_url(pk)
        return self.client.patch(url, data, format="json")
