from tests.annotations import UserFactory, UserFactoryBatch, Authenticate
from collections.abc import Callable
from typing import TypeAlias, TypedDict
from notes.models import Note, Share
from accounts.models import CustomUser

NoteFactory: TypeAlias = Callable[..., Note]
NoteFactoryBatch: TypeAlias = Callable[[int], list[Share]]
ShareFactory: TypeAlias = Callable[..., Share]
ShareFactoryBatch: TypeAlias = Callable[[int], list[Share]]


class PrepareNotes(TypedDict):
    user1: CustomUser
    user2: CustomUser
    notes: list[Note]
