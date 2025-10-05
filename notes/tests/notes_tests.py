from rest_framework.test import APITestCase
from notes.tests.mixins import NotesTestMixin


class NoteCreateTests(NotesTestMixin, APITestCase):

    create_notes = False

    def test_create_success(self):
        