import pytest
from model_bakery import baker


@pytest.fixture
def note_factory():
    def make_notes(n=1, owner=None):
        owner = owner or baker.make("accounts.CustomUser")
        notes = baker.make(
            "notes.Note",
            owner=owner,
            _quantity=n,
        )
        return notes

    return make_notes
