from collections.abc import Callable
from typing import TypeAlias
from rest_framework.test import APIClient
from accounts.models import CustomUser

UserFactory: TypeAlias = Callable[..., CustomUser]
UserFactoryBatch: TypeAlias = Callable[[int], list[CustomUser]]
Authenticate: TypeAlias = Callable[[CustomUser | None], APIClient]
