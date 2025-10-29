from tests.annotations import UserFactory, UserFactoryBatch, Authenticate
from typing import TypedDict, Protocol, Any
from notes.models import Note, Share
from accounts.models import CustomUser


class NoteFactory(Protocol):
    def __call__(self, **kwargs: Any) -> Note: ...


class NoteFactoryBatch(Protocol):
    def __call__(self, n: int) -> list[Note]: ...


class ShareFactory(Protocol):
    def __call__(self, **kwargs: Any) -> Share: ...


class ShareFactoryBatch(Protocol):
    def __call__(self, n: int) -> list[Share]: ...


class GetNotesUrl(Protocol):
    def __call__(self, pk: int | None = None) -> str: ...


class GetSharesUrl(Protocol):
    def __call__(self, note_pk: int | None = None, pk: int | None = None) -> str: ...


class PrepareNotes(TypedDict):
    user1: CustomUser
    user2: CustomUser
    notes: list[Note]
    shares: list[Share]
