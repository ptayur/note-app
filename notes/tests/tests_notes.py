from rest_framework.test import APITestCase
from rest_framework import status
from notes.tests.mixins import NotesAPIMixin


class NoteCreateTests(NotesAPIMixin, APITestCase):
    """
    Integration tests for create endpoint.
    """

    def test_create_success(self):
        """
        Test that note can be created with valid data.
        """
        data = {
            "title": "noteTitle",
            "content": "noteContent",
        }
        response = self.create_note(data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertDictEqual(response.data, self.notes_representation(response.data["id"]))
        self.assertTrue(self.get_note_objects({"pk": response.data["id"]}).exists())


class NoteGetTests(NotesAPIMixin, APITestCase):
    """
    Integration tests for get endpoint.
    """

    def test_get_success(self):
        """
        Test that note can be retrieved with valid id.
        """
        response = self.read_note(1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(response.data, self.notes_representation(response.data["id"]))

    def test_get_nonowner(self):
        """
        Test that get fails if user isn't note owner.
        """
        self.authenticate_client_as(self.nonowner_user)
        response = self.read_note(1)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_list_success(self):
        """
        Test that notes list can be retrieved successfully.
        """
        response = self.read_notes_list()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(response.data, self.notes_representation(user=self.default_user))


class NoteDeleteTests(NotesAPIMixin, APITestCase):
    """
    Integration tests for delete endpoint.
    """

    def setUp(self):
        super().setUp()
        self.note_id = 1

    def test_delete_success(self):
        """
        Test that existing note can be successfully deleted.
        """
        response = self.delete_note(self.note_id)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(self.get_note_objects({"pk": self.note_id}).exists())

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
        self.authenticate_client_as(self.nonowner_user)
        response = self.delete_note(self.note_id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(self.get_note_objects({"pk": self.note_id}).exists())


class NoteUpdateTests(NotesAPIMixin, APITestCase):
    """
    Integration tests for update endpoint.
    """

    def setUp(self):
        super().setUp()
        self.note_id = 1
        self.update_data = {"title": "newTitle"}

    def test_update_success(self):
        """
        Test that existing note can be successfully updated.
        """
        response = self.update_note(self.note_id, self.update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(response.data, self.notes_representation(self.note_id))

    def test_update_nonowner(self):
        """
        Test that update fails if user isn't note owner.
        """
        self.authenticate_client_as(self.nonowner_user)
        response = self.update_note(self.note_id, self.update_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
