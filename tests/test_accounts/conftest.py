import pytest
from .annotations import UserFactory, RegisteredUser


@pytest.fixture
def user_data() -> dict[str, str]:
    data = {
        "username": "testuser",
        "password": "testuser",
        "email": "testuser@email.com",
    }
    return data


@pytest.fixture
def registered_user(user_data: dict[str, str], user_factory: UserFactory) -> RegisteredUser:
    user = user_factory(**user_data)
    user.set_password(user_data["password"])  # hash user's password
    user.save()
    return {"user": user, "credentials": {"email": user_data["email"], "password": user_data["password"]}}
