import pytest
from rest_framework.test import APIClient
from accounts.models import CustomUser
from .factories import *
from .annotations import *


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture()
def authenticate(user_factory: UserFactory, api_client: APIClient) -> Authenticate:
    def do_authentication(user: CustomUser | None = None) -> APIClient:
        api_client.force_authenticate(user or user_factory())
        return api_client

    return do_authentication
