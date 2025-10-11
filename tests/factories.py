import pytest
from collections.abc import Callable
from typing import Any
from model_bakery import baker
from accounts.models import CustomUser


@pytest.fixture
def user_factory() -> Callable[..., CustomUser]:
    def make_user(**kwargs: Any) -> CustomUser:
        return baker.make(
            CustomUser,
            **kwargs,
        )

    return make_user


@pytest.fixture
def user_factory_batch() -> Callable[[int], list[CustomUser]]:
    def make_users(n: int) -> list[CustomUser]:
        return baker.make(
            CustomUser,
            _quantity=n,
        )

    return make_users
