import pytest
from model_bakery import baker
from random import choice
from notes.models import Share, Note


@pytest.fixture
def note_factory():
    def make_notes(n: int = 1, **kwargs) -> Note | list[Note]:
        """
        Create notes for testing.

        Args:
            n:
                Number of notes to create. Default is 1.
            owner:
                Owner of the notes. If not provided, a new user will be created.
            title:
                Title of the notes. If not provided, random titles will be generated.
            content:
                Content of the notes. If not provided, random content will be generated.

        Returns:
            A single `Note` instance if `n = 1`, else a list of `Note` instances.
        """
        notes = baker.make(
            Note,
            _quantity=n,
            **kwargs,
        )

        return notes[0] if n == 1 else notes

    return make_notes


@pytest.fixture
def share_factory(note_permissions):
    def make_shares(n: int = 1, **kwargs) -> Share | list[Share]:
        """
        Create shares for testing.

        Args:
            n:
                Number of shares to create. Default is 1.
            note:
                Note to be shared. If not provided, a new note will be created.
            user:
                User with whom the note is shared. If not provided, a new user will be created.
            permissions:
                List of permissions to be assigned to the share. If not provided, a random permission will
                be assigned.

        Returns:
            A single `Share` instance if `n = 1`, else a list of `Share` instances.
        """
        kwargs.setdefault("permissions", [choice(list(note_permissions.values()))])

        shares = baker.make(
            Share,
            _quantity=n,
            **kwargs,
        )

        return shares[0] if n == 1 else shares

    return make_shares
