from accounts.models import CustomUser


class UserTestMixin:

    create_user = True

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.users_data = [
            {
                "username": f"User{i}",
                "email": f"user{i}@email.com",
                "password": f"user{i}password",
            }
            for i in range(2)
        ]
        if getattr(cls, "create_users", True):
            cls.users = [CustomUser.objects.create_user(**user_data) for user_data in cls.users_data]
