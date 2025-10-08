from accounts.models import CustomUser


class CustomUserMixin:

    @classmethod
    def create_user(cls, data: dict[str, str]) -> CustomUser:
        return CustomUser.objects.create_user(**data)

    def get_user(self, username: str) -> CustomUser:
        return CustomUser.objects.get(username=username)
