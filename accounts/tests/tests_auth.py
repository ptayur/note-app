from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.conf import settings
from accounts.models import CustomUser
from accounts.tests.mixins import AuthTestMixin


class LoginViewTests(AuthTestMixin, APITestCase):
    """Class for LoginView tests"""

    def setUp(self) -> None:
        self.register()

    def test_login_success(self):
        """Test success routine and return values"""
        response = self.login()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
        self.assertIn("refresh_token", response.cookies)

    def test_login_invalid_credentials(self):
        """Test when email or password is invalid"""
        for field, value in [("email", "wrong@email.com"), ("password", "wrongpass")]:
            with self.subTest(field=field):
                data = self.testuser_data.copy()
                data[field] = value
                response = self.login(email=data["email"], password=data["password"])
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class RefreshViewTests(AuthTestMixin, APITestCase):
    """Class for RefreshView tests"""

    def setUp(self) -> None:
        self.register()
        response = self.login()
        self.access_token = response.data["access_token"]
        self.refresh_token = response.cookies.get("refresh_token").value

    def test_refresh_success(self):
        """Test success routine and return values"""
        # Test success routine with `refresh_token` in request body
        with self.subTest("Body"):
            self.client.cookies.clear()
            response = self.refresh(refresh_token=self.refresh_token)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn("access_token", response.data)
            self.assertNotEqual(self.access_token, response.data["access_token"])
            self.assertIn("refresh_token", response.cookies)
            if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", False):
                self.assertNotEqual(self.refresh_token, response.cookies.get("refresh_token").value)
        # Test success routine with `refresh_token` in request cookie
        with self.subTest("Cookie"):
            response = self.refresh()
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn("access_token", response.data)
            self.assertNotEqual(self.access_token, response.data["access_token"])
            self.assertIn("refresh_token", response.cookies)
            if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", False):
                self.assertNotEqual(self.refresh_token, response.cookies.get("refresh_token").value)

    def test_refresh_no_token(self):
        """Test when refresh_token is missing in HTTP body and cookie"""
        self.client.cookies.clear()
        response = self.refresh()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_refresh_invalid_token(self):
        """Test when refresh_token is invalid in HTTP body or cookie"""
        # Test invalid refresh_token in HTTP cookie
        with self.subTest("Cookie"):
            self.client.cookies["refresh_token"] = "invalid_token"
            response = self.refresh()
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Test invalid refresh_token in HTTP body
        with self.subTest("Body"):
            self.client.cookies.clear()
            response = self.refresh(refresh_token="invalid_token")
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LogoutViewTests(AuthTestMixin, APITestCase):
    """Class for LogoutView tests"""

    def setUp(self) -> None:
        self.register()
        response = self.login()
        self.refresh_token = response.cookies.get("refresh_token").value

    def test_logout_success(self):
        """Test success routine"""
        # Test logout using HTTP cookie
        with self.subTest("Cookie"):
            response = self.logout()
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Test logout using HTTP body
        self.client.cookies.clear()
        with self.subTest("Body"):
            response = self.logout(refresh_token=self.refresh_token)
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_logout_no_token(self):
        """Test when refresh_token is missing in HTTP body and cookie"""
        self.client.cookies.clear()
        response = self.logout()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class RegisterViewTests(AuthTestMixin, APITestCase):
    """Class for RegisterView tests"""

    def test_register_success(self):
        """Test success routine and return values"""
        response = self.register()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["user"], {k: v for k, v in self.testuser_data.items() if k != "password"})
        self.assertTrue(CustomUser.objects.filter(email=self.testuser_data["email"]).exists())

    def test_register_duplicate_data(self):
        """Test when username or email is already used"""
        self.register()  # Init testuser
        # Test username duplication
        with self.subTest("Username"):
            response = self.register(email="different@email.com")
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(CustomUser.objects.filter(username=self.testuser_data["username"]).count(), 1)
        # Test email duplication
        with self.subTest("Email"):
            response = self.register(username="differentuser")
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(CustomUser.objects.filter(email=self.testuser_data["email"]).count(), 1)
