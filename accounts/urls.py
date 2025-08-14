from django.urls import path
from django.contrib.auth import views as auth_views
from accounts import views

urlpatterns = [
    path("login/", views.auth_view, name="login"),
    path(
        "logout/",
        auth_views.LogoutView.as_view(next_page="index"),
        name="logout",
    ),
]
