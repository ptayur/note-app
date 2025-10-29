from tests.annotations import UserFactory, UserFactoryBatch, Authenticate
from collections.abc import Callable
from typing import TypeAlias, TypedDict, Protocol
from notes.models import Note, Share
from accounts.models import CustomUser

NoteFactory: TypeAlias = Callable[..., Note]
NoteFactoryBatch: TypeAlias = Callable[[int], list[Share]]
ShareFactory: TypeAlias = Callable[..., Share]
ShareFactoryBatch: TypeAlias = Callable[[int], list[Share]]


class GetNotesUrl(Protocol):
    def __call__(self, pk: int | None = None) -> str: ...


class GetSharesUrl(Protocol):
    def __call__(self, note_pk: int | None = None, pk: int | None = None) -> str: ...


class PrepareNotes(TypedDict):
    user1: CustomUser
    user2: CustomUser
    notes: list[Note]
    shares: list[Share]
