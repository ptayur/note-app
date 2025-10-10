import pytest
from model_bakery import baker
from notes.models import NotePermission
from .factories import note_factory, share_factory


@pytest.fixture
def note_permissions():
    """
    Get possible note permissions.

    Args:
        None

    Returns:
        A dict containing permission code as key and `NotePermission` instance as value.

        Example: `{"read": <NotePermission: [read]>, ...}`
    """
    note_permissions = {"read": "", "write": "", "delete": ""}
    for perm in note_permissions.keys():
        note_permissions[perm] = baker.make(
            NotePermission,
            code=perm,
            description=f"Can {perm} note",
        )
    return note_permissions


@pytest.fixture
def prepare_notes(user_factory, note_factory, share_factory, note_permissions):
    user1 = user_factory()
    user2 = user_factory()

    notes_data = [
        {"owner": user1, "title": "Shopping List", "content": "Buy milk and eggs"},
        {"owner": user1, "title": "Meeting Notes", "content": "Discuss project timeline"},
        {"owner": user1, "title": "Private Note", "content": "This is a private note"},
        {"owner": user2, "title": "Work Tasks", "content": "Finish the report"},
        {"owner": user2, "title": "Holiday Plans", "content": "Visit the beach"},
    ]
    notes = []
    for note_data in notes_data:
        note = note_factory(**note_data)
        notes.append(note)

    shares_data = [
        {"note": notes[0], "user": user2, "permissions": [note_permissions["read"]]},
        {"note": notes[1], "user": user2, "permissions": [note_permissions["read"], note_permissions["write"]]},
        {"note": notes[3], "user": user1, "permissions": [note_permissions["read"]]},
    ]
    for share_data in shares_data:
        share_factory(**share_data)

    return {"user1": user1, "user2": user2, "notes": notes}
