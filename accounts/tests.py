from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.conf import settings
from .models import CustomUser


class LoginViewTests(APITestCase):
    """Class for LoginView tests"""

    def setUp(self) -> None:
        self.client = APIClient()
        self.login_url = "/auth/login/"

        self.user_data = {
            "username": "testuser",
            "email": "test@email.com",
            "password": "testuser",
        }
        CustomUser.objects.create_user(**self.user_data)

    def test_login_sucess(self):
        """Test success routine and return values"""
        response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
        self.assertIn("refresh_token", response.data)
        self.assertIn("refresh_token", response.cookies)
        self.assertEqual(
            response.data["refresh_token"], response.cookies.get("refresh_token").value
        )

    def test_login_invalid_credentials(self):
        """Test when email or password is invalid"""
        # Test invalid email
        with self.subTest("Email"):
            invalid_email = "invalid"
            response = self.client.post(
                self.login_url,
                {"email": invalid_email, "password": "testuser"},
                format="json",
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertFalse(CustomUser.objects.filter(email=invalid_email).exists())

        # Test invalid password
        with self.subTest("Password"):
            response = self.client.post(
                self.login_url,
                {"email": self.user_data["email"], "password": "wrong"},
                format="json",
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class RefreshViewTests(APITestCase):
    """Class for RefreshView tests"""

    def setUp(self) -> None:
        self.client = APIClient()
        self.login_url = "/auth/login/"
        self.refresh_url = "/auth/refresh/"

        self.user_data = {
            "username": "testuser",
            "email": "test@email.com",
            "password": "testuser",
        }
        self.user = CustomUser.objects.create_user(**self.user_data)

    def test_refresh_success(self):
        """Test success routine and return values"""
        login_response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )
        old_refresh_token = login_response.data["refresh_token"]
        old_access_token = login_response.data["access_token"]

        response = self.client.post(self.refresh_url, data={}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test values in HTTP body
        with self.subTest("Body"):
            self.assertIn("access_token", response.data)
            self.assertIn("refresh_token", response.data)
            self.assertNotEqual(old_access_token, response.data["access_token"])
            if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", True):
                self.assertNotEqual(old_refresh_token, response.data["refresh_token"])

        # Test values in HTTP cookie
        with self.subTest("Cookie"):
            self.assertIn("refresh_token", response.cookies)
            if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", True):
                self.assertNotEqual(old_refresh_token, response.cookies.get("refresh_token").value)

    def test_refresh_no_token(self):
        """Test when refresh_token is missing in HTTP body and cookie"""
        response = self.client.post(self.refresh_url, data={}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_refresh_invalid_token(self):
        """Test when refresh_token is invalid in HTTP body or cookie"""
        # Test invalid refresh_token in HTTP body
        with self.subTest("Body"):
            response = self.client.post(
                self.refresh_url, data={"refresh_token": "invalid_token"}, format="json"
            )
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Test invalid refresh_token in HTTP cookie
        with self.subTest("Cookie"):
            self.client.cookies.clear()  # Clear cookie as previous response sets it
            self.client.cookies["refresh_token"] = "invalid_token"
            response = self.client.post(self.refresh_url, data={}, format="json")
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_deleted_user(self):
        """Test when user for refresh_token was deleted"""
        login_response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )
        self.user.delete()

        response = self.client.post(
            self.refresh_url,
            data={"refresh_token": login_response.data["refresh_token"]},
            format="json",
        )
        self.user = CustomUser.objects.create_user(**self.user_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LogoutViewTests(APITestCase):
    """Class for LogoutView tests"""

    def setUp(self) -> None:
        self.client = APIClient()
        self.logout_url = "/auth/logout/"
        self.login_url = "/auth/login/"

        self.user_data = {
            "username": "testuser",
            "email": "test@email.com",
            "password": "testuser",
        }
        CustomUser.objects.create_user(**self.user_data)

    def test_logout_success(self):
        """Test success routine"""
        login_response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )
        refresh_token = login_response.data["refresh_token"]

        # Test logout using HTTP body
        with self.subTest("Body"):
            self.client.cookies.clear()  # Clear cookies as '/auth/login/' sets it
            response = self.client.post(
                self.logout_url, data={"refresh_token": refresh_token}, format="json"
            )
            self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

        # Test logout using HTTP cookie
        with self.subTest("Cookie"):
            self.client.cookies["refresh_token"] = refresh_token  # Set refresh_token in cookie
            response = self.client.post(self.logout_url, data={}, format="json")
            self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_logout_no_token(self):
        """Test when refresh_token is missing in HTTP body and cookie"""
        response = self.client.post(self.logout_url, data={}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class RegisterViewTests(APITestCase):
    """Class for RegisterView tests"""

    def setUp(self) -> None:
        self.client = APIClient()
        self.register_url = "/auth/register/"

        self.user_data = {
            "username": "testuser",
            "email": "testuser@email.com",
            "password": "testuser",
        }
        self.duplicate_data = {
            "username": "duplicateuser",
            "email": "duplicate@email.com",
            "password": "duplicateuser",
        }
        CustomUser.objects.create_user(**self.duplicate_data)

    def test_register_success(self):
        """Test success routine and return values"""
        user_data = self.user_data
        response = self.client.post(self.register_url, data=user_data, format="json")
        user_data.pop("password")  # Delete 'password' entry as API shouldn't return password
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, user_data)
        self.assertTrue(CustomUser.objects.filter(email=user_data["email"]).exists())

    def test_register_duplicate_data(self):
        """Test when username or email is already used"""
        user_data = self.duplicate_data.copy()

        # Test username duplication
        with self.subTest("Username"):
            user_data["email"] = "different@email.com"
            response = self.client.post(self.register_url, data=user_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(CustomUser.objects.filter(username=user_data["username"]).count(), 1)
            user_data["email"] = self.duplicate_data["email"]  # Set duplicated email back

        # Test email
        with self.subTest("Email"):
            user_data["username"] = "differentuser"
            response = self.client.post(self.register_url, data=user_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(CustomUser.objects.filter(email=user_data["email"]).count(), 1)
