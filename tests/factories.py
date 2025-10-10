import pytest
from model_bakery import baker
from accounts.models import CustomUser


@pytest.fixture
def user_factory():
    def make_users(n: int = 1, **kwargs) -> CustomUser | list[CustomUser]:
        users = baker.make(
            CustomUser,
            _quantity=n,
            **kwargs,
        )
        return users[0] if n == 1 else users

    return make_users
