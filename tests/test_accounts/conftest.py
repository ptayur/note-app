import pytest
from .annotations import UserFactory, PrepareAccountsEnv


@pytest.fixture
def prepare_accounts_env(user_factory: UserFactory) -> PrepareAccountsEnv:
    user_data = {
        "username": "testuser",
        "password": "testuser",
        "email": "testuser@email.com",
    }
    user = user_factory(**user_data)
    user.set_password(user_data["password"])  # hash user's password
    user.save()
    return {"user": user, "credentials": {"email": user_data["email"], "password": user_data["password"]}}
