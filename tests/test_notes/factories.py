import pytest
from collections.abc import Callable
from typing import Any
from model_bakery import baker
from notes.models import Share, Note


@pytest.fixture
def note_factory() -> Callable[..., Note]:
    def make_note(**kwargs: Any) -> Note:
        return baker.make(
            Note,
            **kwargs,
        )

    return make_note


@pytest.fixture
def note_factory_batch() -> Callable[[int], list[Note]]:
    def make_notes(n: int) -> list[Note]:
        return baker.make(
            Note,
            _quantity=n,
        )

    return make_notes


@pytest.fixture
def share_factory() -> Callable[..., Share]:
    def make_share(**kwargs) -> Share:
        return baker.make(
            Share,
            **kwargs,
        )

    return make_share


@pytest.fixture
def share_factory_batch() -> Callable[[int], list[Share]]:
    def make_shares(n: int) -> list[Share]:
        return baker.make(
            Share,
            _quantity=n,
        )

    return make_shares
