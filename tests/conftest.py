import pytest
from model_bakery import baker


@pytest.fixture
def user_factory():
    def make_users(n=1, **kwargs):
        return baker.make(
            "accounts.CustomUser",
            _quantity=n,
            **kwargs,
        )

    return make_users


@pytest.fixture
def client_factory(user_factory):
    from rest_framework.test import APIClient

    def make_client(authenticated=False, real_auth=False):
        client = APIClient()
        user = user_factory(password="testpassword")[0]
        if authenticated:
            if real_auth:
                client.post(
                    "/api/users/login/",
                    {
                        "email": user.email,
                        "password": "testpassword",
                    },
                    format="json",
                )
            else:
                client.force_authenticate(user=user)
        return client, user

    return make_client
