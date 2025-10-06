from rest_framework.test import APITestCase
from rest_framework import status
from notes.tests.mixins import NotesActionsTestMixin, NotesTestMixin
from accounts.tests.mixins import AuthTestMixin
from notes.models import Note


class NoteCreateTests(NotesActionsTestMixin, NotesTestMixin, AuthTestMixin, APITestCase):
    """
    Integration tests for create endpoint.
    """

    create_notes = False

    def setUp(self):
        self.client = self.authenticate(self.users_data[0])

    def test_create_success(self):
        """
        Test that note can be created with valid data.
        """
        response = self.create_note(self.notes_data[0])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Note.objects.filter(id=response.data["id"]).exists())


class NoteGetTests(NotesActionsTestMixin, NotesTestMixin, AuthTestMixin, APITestCase):
    """
    Integration tests for get endpoint.
    """

    def setUp(self):
        self.client = self.authenticate(self.users_data[0])

    def test_get_success(self):
        """
        Test that note can be retrieved with valid id.
        """
        response = self.read_note(1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictContainsSubset(self.notes_data[0], response.data)

    def test_get_nonowner(self):
        """
        Test that get fails if user isn't note owner.
        """
        self.client = self.authenticate(self.users_data[1])
        response = self.read_note(1)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_list_success(self):
        """
        Test that notes list can be retrieved successfully.
        """
        response = self.read_notes_list()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.notes_data))


class NoteDeleteTests(NotesActionsTestMixin, NotesTestMixin, AuthTestMixin, APITestCase):
    """
    Integration tests for delete endpoint.
    """

    def setUp(self):
        self.client = self.authenticate(self.users_data[0])

    def test_delete_success(self):
        """
        Test that existing note can be successfully deleted.
        """
        response = self.delete_note(1)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Note.objects.filter(id=1).exists())

    def test_delete_nonexistent(self):
        """
        Test that delete fails if note doesn't exist.
        """
        response = self.delete_note(999)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_nonowner(self):
        """
        Test that delete fails if user isn't note owner.
        """
        self.client = self.authenticate(self.users_data[1])
        response = self.delete_note(1)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Note.objects.filter(id=1).exists())


class NoteUpdateTests(NotesActionsTestMixin, NotesTestMixin, AuthTestMixin, APITestCase):
    """
    Integration tests for update endpoint.
    """

    def setUp(self):
        self.client = self.authenticate(self.users_data[0])
        self.note_id = 1
        self.update_data = {"title": "newTitle"}

    def test_update_success(self):
        """
        Test that existing note can be successfully updated.
        """
        response = self.update_note(self.note_id, self.update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictContainsSubset(self.update_data, response.data)
        note = Note.objects.get(id=self.note_id)
        for key in self.update_data.keys():
            self.assertEqual(self.update_data[key], getattr(note, key))

    def test_update_nonowner(self):
        """
        Test that update fails if user isn't note owner.
        """
        self.client = self.authenticate(self.users_data[1])
        response = self.update_note(self.note_id, self.update_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        note = Note.objects.get(id=self.note_id)
        for key in self.update_data.keys():
            self.assertNotEqual(self.update_data[key], getattr(note, key))
