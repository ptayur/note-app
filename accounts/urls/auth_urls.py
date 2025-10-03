from django.urls import path
from accounts.views import (
    LogoutView,
    RegisterView,
    LoginView,
    RefreshView,
    MeView,
    UsernameValidationView,
    EmailValidationView,
    PasswordValidationView,
)

urlpatterns = [
    # Auth
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshView.as_view(), name="refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    # Validation
    path("validate-username/", UsernameValidationView.as_view(), name="validate_username"),
    path("validate-email/", EmailValidationView.as_view(), name="validate_email"),
    path("validate-password/", PasswordValidationView.as_view(), name="validate_password"),
]
