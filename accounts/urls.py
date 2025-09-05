from django.urls import path
from django.views.generic import TemplateView
from .views.auth import (
    LogoutView,
    RegisterView,
    LoginView,
    RefreshView,
)
from .views.validation import (
    UsernameValidationView,
    EmailValidationView,
    PasswordValidationView,
)

urlpatterns = [
    # Render
    path("", TemplateView.as_view(template_name="accounts/auth.html")),
    # Auth
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshView.as_view(), name="refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register/", RegisterView.as_view(), name="register"),
    # Validation
    path("validation/username/", UsernameValidationView.as_view(), name="validation_username"),
    path("validation/email/", EmailValidationView.as_view(), name="validation_email"),
    path("validation/password/", PasswordValidationView.as_view(), name="validation_password"),
]
