import pytest
from typing import Any
from model_bakery import baker
from notes.models import Share, Note
from .annotations import NoteFactory, NoteFactoryBatch, ShareFactory, ShareFactoryBatch


@pytest.fixture
def note_factory() -> NoteFactory:
    def make_note(**kwargs: Any) -> Note:
        return baker.make(
            Note,
            **kwargs,
        )

    return make_note


@pytest.fixture
def note_factory_batch() -> NoteFactoryBatch:
    def make_notes(n: int) -> list[Note]:
        return baker.make(
            Note,
            _quantity=n,
        )

    return make_notes


@pytest.fixture
def share_factory() -> ShareFactory:
    def make_share(**kwargs) -> Share:
        return baker.make(
            Share,
            **kwargs,
        )

    return make_share


@pytest.fixture
def share_factory_batch() -> ShareFactoryBatch:
    def make_shares(n: int) -> list[Share]:
        return baker.make(
            Share,
            _quantity=n,
        )

    return make_shares
