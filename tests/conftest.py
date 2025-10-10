import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from accounts.models import CustomUser
from .factories import user_factory


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture()
def authenticate(user_factory, api_client):
    def do_authentication(user: CustomUser | None = None) -> APIClient:
        api_client.force_authenticate(user or user_factory())
        return api_client

    return do_authentication
