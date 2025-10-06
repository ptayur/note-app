from rest_framework.test import APITestCase
from rest_framework import status
from django.conf import settings
from accounts.models import CustomUser
from accounts.tests.mixins import AuthTestMixin, UserTestMixin, AuthActionsTestMixin


class LoginViewTests(AuthActionsTestMixin, UserTestMixin, APITestCase):
    """
    Integration tests for login endpoint.
    """

    def test_login_success(self):
        """
        Test that user can log in successfully using valid credentials.
        """
        response = self.login(self.users_data[0])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
        self.assertIn("refresh_token", response.cookies)

    def test_login_invalid_credentials(self):
        """
        Test that login fails when user provides invalid credentials.
        """
        cases = {
            "Wrong Email": {"email": "wrong@email.com", "password": self.users_data[0]["password"]},
            "Wrong Password": {"email": self.users_data[0]["email"], "password": "wrongpass"},
        }
        for label, data in cases.items():
            with self.subTest(label):
                response = self.login(data)
                self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RefreshViewTests(AuthActionsTestMixin, AuthTestMixin, UserTestMixin, APITestCase):
    """
    Integration tests for refresh endpoint.
    """

    def setUp(self) -> None:
        """
        Authenticate client before each test.
        """
        self.client = self.authenticate(self.users_data[0])

    def test_refresh_success(self):
        """
        Test that user can refresh his token with valid `refresh_token`.
        """
        for source in ["Cookie", "Body"]:
            with self.subTest(source):
                self.client = self.authenticate(self.users_data[0])
                if source == "Cookie":
                    response = self.refresh()
                else:
                    self.client.cookies.clear()
                    response = self.refresh(self.refresh_token)
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertIn("access_token", response.data)
                self.assertNotEqual(self.access_token, response.data["access_token"])
                self.assertIn("refresh_token", response.cookies)
                if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", False):
                    self.assertNotEqual(self.refresh_token, response.cookies.get("refresh_token").value)

    def test_refresh_no_token(self):
        """
        Test that refresh fails if `refresh_token` isn't provided.
        """
        self.client.cookies.clear()
        response = self.refresh()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_refresh_invalid_token(self):
        """
        Test that refresh fails if `refresh_token` is invalid.
        """
        for source in ["Cookie", "Body"]:
            with self.subTest(source):
                if source == "Cookie":
                    self.client.cookies["refresh_token"] = "invalid_token"
                    response = self.refresh()
                else:
                    self.client.cookies.clear()
                    response = self.refresh(refresh_token="invalid_token")
                self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LogoutViewTests(AuthActionsTestMixin, AuthTestMixin, UserTestMixin, APITestCase):
    """
    Integration tests for logout endpoint.
    """

    def setUp(self) -> None:
        """
        Authenticate client before each test.
        """
        self.client = self.authenticate(self.users_data[0])

    def test_logout_success(self):
        """
        Test that user can logout successfully with valid `refresh_token`.
        """
        for source in ["Cookie", "Body"]:
            with self.subTest(source):
                if source == "Cookie":
                    response = self.logout()
                else:
                    self.client.cookies.clear()
                    response = self.logout(self.refresh_token)
                self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_logout_no_token(self):
        """
        Test that logout fails if `refresh_token` isn't provided.
        """
        self.client.cookies.clear()
        response = self.logout()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class RegisterViewTests(AuthActionsTestMixin, UserTestMixin, APITestCase):
    """
    Integration tests for register endpoint.
    """

    create_users = False

    def test_register_success(self):
        """
        Test that user can register using valid data.
        """
        response = self.register(self.users_data[0])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["user"], {k: v for k, v in self.users_data[0].items() if k != "password"})
        self.assertTrue(CustomUser.objects.filter(email=self.users_data[0]["email"]).exists())

    def test_register_duplicate_data(self):
        """
        Test that register fails if user with provided data exists.
        """
        self.register(self.users_data[0])  # Init user
        cases = {
            "Username": ({"email": "different@email.com", "username": self.users_data[0]["username"]}, "username"),
            "Email": ({"email": self.users_data[0]["email"], "username": "differentuser"}, "email"),
        }
        for label, (data, field) in cases.items():
            with self.subTest(label):
                response = self.register(data)
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertEqual(CustomUser.objects.filter(**{field: self.users_data[0][field]}).count(), 1)
