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
def prepare_notes_env(
    user_factory_batch: UserFactoryBatch,
    note_factory: NoteFactory,
    share_factory: ShareFactory,
    note_permissions: dict[str, NotePermission],
) -> PrepareNotesEnv:
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
        {"note": notes[0], "user": user2, "permissions": [note_permissions["read"], note_permissions["delete"]]},
        {"note": notes[1], "user": user2, "permissions": [note_permissions["read"], note_permissions["write"]]},
        {"note": notes[3], "user": user1, "permissions": [note_permissions["read"]]},
    ]
    shares = []
    for share_data in shares_data:
        share = share_factory(**share_data)
        shares.append(share)

    return {"user1": user1, "user2": user2, "notes": notes, "shares": shares}


@pytest.fixture
def prepare_shares_env(
    user_factory_batch: UserFactoryBatch,
    note_factory: NoteFactory,
    share_factory: ShareFactory,
    note_permissions: dict[str, NotePermission],
) -> PrepareSharesEnv:
    owner, user_norights, user_read = user_factory_batch(3)
    note = note_factory(owner=owner)
    share = share_factory(note=note, user=user_read, permissions=[note_permissions["read"]])
    return {"owner": owner, "user_norights": user_norights, "user_read": user_read, "note": note, "share": share}


@pytest.fixture
def get_notes_url() -> GetNotesUrl:
    def build_url(pk: int | None = None) -> str:
        if pk:
            return f"/api/notes/{pk}/"
        return "/api/notes/"

    return build_url


@pytest.fixture
def get_shares_url() -> GetSharesUrl:
    def build_url(note_pk: int | None = None, pk: int | None = None) -> str:
        if note_pk is not None:
            return f"/api/notes/{note_pk}/shares/"
        if pk is not None:
            return f"/api/shares/{pk}/"
        raise ValueError("Either 'note_pk' or 'pk' must be provided.")

    return build_url
