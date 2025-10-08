from rest_framework.response import Response
from accounts.models import CustomUser
from accounts.tests.mixins import CustomUserMixin
from notes.tests.mixins import NotesMixin


class NotesAPIMixin(NotesMixin, CustomUserMixin):
    """
    Test mixin that provides methods for testing `Note` API.

    Attributes:
        default_user:
            The `CustomUser` instance by default used for requests.
        nonowner_user:
            The `CustomUser` instance that can be used to test unathorized access.
        default_note:
            `Note` instance owned by `default_user`.
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.default_user = cls.create_user(
            {
                "username": "default_user",
                "email": "default@email.com",
                "password": "password",
            }
        )
        cls.nonowner_user = cls.create_user(
            {
                "username": "nonowner_user",
                "email": "nonowner@email.com",
                "password": "password",
            }
        )

    def setUp(self):
        super().setUp()
        self.client.force_authenticate(self.default_user)
        self.default_note = self.create_note_object(
            {
                "owner": self.default_user,
                "title": "Title",
                "content": "Content",
            }
        )

    def authenticate_client_as(self, user: CustomUser) -> None:
        """
        Authenticate the API client as given `user`.

        Args:
            user:
                User to authenticate as.
        """
        self.client.force_authenticate(user)

    def read_notes_list(self) -> Response:
        """
        Perform `GET` request to retrieve list of notes.

        Returns:
            The DRF response object.
        """
        return self.client.get(self._get_notes_url(), format="json")

    def create_note(self, data: dict[str, str]) -> Response:
        """
        Perform `POST` request to create a new note.

        Args:
            data:
                A dict containing required fields:
                - `title` (str)
                - `content` (str)

                Example:
                {
                    "title": "noteTitle",
                    "content": "noteContent"
                }

        Returns:
            The DRF response object.
        """
        return self.client.post(self._get_notes_url(), data, format="json")

    def read_note(self, pk: int) -> Response:
        """
        Perform `GET` request to retrieve a specific note.

        Args:
            pk:
                Primary key of the note.

        Returns:
            The DRF response object.
        """
        return self.client.get(self._get_notes_url(pk), format="json")

    def delete_note(self, pk: int) -> Response:
        """
        Perform `DELETE` request to remove a note.

        Args:
            pk:
                Primary key of the note.

        Returns:
            The DRF response object.
        """
        return self.client.delete(self._get_notes_url(pk), format="json")

    def update_note(self, pk: int, data: dict[str, str]) -> Response:
        """
        Perform `PATCH` request to partially update a note.

        Args:
            pk:
                Primary key of the note.
            data:
                A dict containing updated fields:
                - `title` (str)
                - `content` (str)

                Example:
                {
                    "title": "newTitle"
                }

        Returns:
            The DRF response object.
        """
        return self.client.patch(self._get_notes_url(pk), data, format="json")
