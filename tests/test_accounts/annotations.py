from tests.annotations import UserFactory, UserFactoryBatch, Authenticate
from accounts.models import CustomUser
from typing import TypedDict


class PrepareAccountsEnv(TypedDict):
    user: CustomUser
    credentials: dict[str, str]
