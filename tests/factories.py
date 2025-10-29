import pytest
from typing import Any
from model_bakery import baker
from accounts.models import CustomUser
from .annotations import UserFactory, UserFactoryBatch


@pytest.fixture
def user_factory() -> UserFactory:
    def make_user(**kwargs: Any) -> CustomUser:
        return baker.make(
            CustomUser,
            **kwargs,
        )

    return make_user


@pytest.fixture
def user_factory_batch() -> UserFactoryBatch:
    def make_users(n: int) -> list[CustomUser]:
        return baker.make(
            CustomUser,
            _quantity=n,
        )

    return make_users
