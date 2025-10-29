from typing import Protocol, Any
from rest_framework.test import APIClient
from accounts.models import CustomUser


class UserFactory(Protocol):
    def __call__(self, **kwargs: Any) -> CustomUser: ...


class UserFactoryBatch(Protocol):
    def __call__(self, n: int) -> list[CustomUser]: ...


class Authenticate(Protocol):
    def __call__(self, user: CustomUser | None = None) -> APIClient: ...
