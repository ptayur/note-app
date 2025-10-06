from rest_framework.response import Response
from django.urls import reverse
from notes.models import Note
from accounts.tests.mixins import UserTestMixin


class NotesTestMixin(UserTestMixin):
    """
    Mixin for creating test notes.

    By default creates 5 notes in `notes_data`.
    Can be prevented using `create_notes = False`.
    """

    create_notes = True

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.notes_data = [
            {
                "title": f"title{i}",
                "content": f"content{i}",
            }
            for i in range(5)
        ]
        if getattr(cls, "create_notes", True):
            cls.notes = [Note.objects.create(owner=cls.users[0], **note_data) for note_data in cls.notes_data]


class NotesActionsTestMixin:
    """
    Mixin for actions on notes.

    Provides basic methods for requests to endpoints.
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

    def _get_note_url(self, pk: int | None = None) -> str:
        """
        Forms note's resource URL with provided `pk`.

        Returns URL string of format `/notes/<int:pk>/`.
        """
        if pk:
            return reverse("notes-detail", kwargs={"pk": pk})
        return reverse("notes-list")

    def read_notes_list(self) -> Response:
        """
        Makes `GET` request to `notes-list` endpoint.

        Returns `Response`.
        """
        return self.client.get(self._get_note_url(), format="json")

    def create_note(self, data: dict[str, str]) -> Response:
        """
        Makes `POST` request to `notes-list` endpoint.

        Returns `Response`.
        """
        return self.client.post(self._get_note_url(), data, format="json")

    def read_note(self, pk: int) -> Response:
        """
        Makes `GET` request to `notes-detail` endpoint.

        Returns `Response`.
        """
        return self.client.get(self._get_note_url(pk), format="json")

    def delete_note(self, pk: int) -> Response:
        """
        Makes `DELETE` request to `notes-detail` endpoint.

        Returns `Response`.
        """
        return self.client.delete(self._get_note_url(pk), format="json")

    def update_note(self, pk: int, data: dict[str, str]) -> Response:
        """
        Makes `PATCH` request to `notes-detail` endpoint.

        Returns `Response`.
        """
        return self.client.patch(self._get_note_url(pk), data, format="json")
