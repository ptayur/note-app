import pytest
from model_bakery import baker
from notes.models import NotePermission
from .annotations import *
from .factories import *


@pytest.fixture
def note_permissions() -> dict[str, NotePermission]:
    """
    Get possible note permissions.

    Args:
        None

    Returns:
        A dict containing permission code as key and `NotePermission` instance as value.

        Example: `{"read": <NotePermission: [read]>, ...}`
    """
    permissions = ["read", "write", "delete"]
    note_permissions = {}
    for perm in permissions:
        note_permissions[perm] = baker.make(
            NotePermission,
            code=perm,
            description=f"Can {perm} note",
        )
    return note_permissions


@pytest.fixture
def prepare_notes(
    user_factory_batch: UserFactoryBatch,
    note_factory: NoteFactory,
    share_factory: ShareFactory,
    note_permissions: dict[str, NotePermission],
) -> PrepareNotes:
    user1, user2 = user_factory_batch(2)

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
    shares = []
    for share_data in shares_data:
        share = share_factory(**share_data)
        shares.append(share)

    return {"user1": user1, "user2": user2, "notes": notes, "shares": shares}
