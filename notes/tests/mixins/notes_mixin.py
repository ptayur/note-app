from accounts.models import CustomUser
from notes.models import Note
from django.db.models import QuerySet
from django.urls import reverse
from typing import Any, overload


class NotesMixin:
    """
    Base mixin that provides utility methods for working with the `Note` model.
    """

    def _get_notes_url(self, pk: int | None = None) -> str:
        """
        Build URL for the notes API endpoint.

        Args:
            pk:
                Primary key of the note.
                - If provided, returns the detail endpoint URL.
                - If ommited, returns the list endpoint URL.

        Returns:
            The URL path for the corresponding notes endpoint.
        """
        if pk:
            return reverse("notes-detail", args=[pk])
        return reverse("notes-list")

    def _serialize_note(self, note: Note, many: bool = False) -> dict[str, Any]:
        """
        Generate a JSON-compatible representation of a `Note` object.

        Args:
            note:
                The `Note` instance to serialize.
            many:
                If True, returns a shortened representation for list view.

        Returns:
            A dict matching the expected API response structure.
        """
        if many:
            return {
                "url": f"http://testserver{self._get_notes_url(note.id)}",
                "id": note.id,
                "title": note.title,
            }
        return {
            "url": f"http://testserver{self._get_notes_url(note.id)}",
            "id": note.id,
            "owner": note.owner.username,
            "title": note.title,
            "content": note.content,
            "created_at": note.created_at.isoformat().replace("+00:00", "Z"),
            "updated_at": note.updated_at.isoformat().replace("+00:00", "Z"),
            "shares": [],
        }

    def create_note_object(self, data: dict[str, Any]) -> Note:
        """
        Create and save `Note` instance in the database.

        Args:
            data:
                A dict containing required fields:
                - `owner` (CustomUser)
                - `title` (str)
                - `content` (str)

                Example:
                {
                    "owner": default_user,
                    "title": "noteTitle",
                    "content": "noteContent"
                }

        Returns:
            The created `Note` instance.
        """
        return Note.objects.create(**data)

    def get_note_objects(self, filter: dict[str, Any]) -> QuerySet:
        """
        Retrieve a queryset of `Note` objects matching the given filter.

        Args:
            filter:
                A dict containing filtering options.

        Returns:
            A queryset of matching `Note` instances.
        """
        return Note.objects.filter(**filter)

    @overload
    def notes_representation(self, pk: int) -> dict[str, Any]:
        """
        Retrieve a JSON representation of a single note.

        Args:
            pk:
                The primary key of the note.

        Returns:
            A dict matching API response format.

        Raises:
            ValueError:
                If `pk` is not provided.
        """
        ...

    @overload
    def notes_representation(self, user: CustomUser) -> list[dict[str, Any]]:
        """
        Retrieve JSON representation of all notes belonging to a user.

        Args:
            user:
                The user whose notes should be represented.

        Returns:
            A list of serialized notes in API response format.

        Raises:
            ValueError:
                If `user` is not provided.
        """
        ...

    def notes_representation(
        self, pk: int | None = None, user: CustomUser | None = None
    ) -> list[dict[str, Any]] | dict[str, Any]:
        if pk is not None:
            return self._serialize_note(self.get_note_objects({"pk": pk}).get())
        if user is not None:
            return [self._serialize_note(note, many=True) for note in self.get_note_objects({"owner": user})]
        raise ValueError("Either 'pk' or 'user' must be provided.")
