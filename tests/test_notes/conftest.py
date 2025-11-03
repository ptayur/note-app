import pytest
from .annotations import *
from .factories import *


@pytest.fixture
def prepare_notes_env(
    user_factory_batch: UserFactoryBatch,
    note_factory: NoteFactory,
    share_factory: ShareFactory,
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
        {"note": notes[0], "user": user2, "role": "viewer"},
        {"note": notes[1], "user": user2, "role": "editor"},
        {"note": notes[3], "user": user1, "role": "viewer"},
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
) -> PrepareSharesEnv:
    owner, user_norights, viewer = user_factory_batch(3)
    note = note_factory(owner=owner)
    share = share_factory(note=note, user=viewer, role="viewer")
    return {"owner": owner, "user_norights": user_norights, "viewer": viewer, "note": note, "share": share}


@pytest.fixture
def get_notes_url() -> GetNotesUrl:
    def build_url(pk: int | None = None) -> str:
        if pk:
            return f"/api/v1/notes/{pk}/"
        return "/api/v1/notes/"

    return build_url


@pytest.fixture
def get_shares_url() -> GetSharesUrl:
    def build_url(note_pk: int, pk: int | None = None) -> str:
        if pk:
            return f"/api/v1/notes/{note_pk}/shares/{pk}/"
        return f"/api/v1/notes/{note_pk}/shares/"

    return build_url
