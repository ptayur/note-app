from django.urls import path
from note_app import views


urlpatterns = [
    path("", views.home, name="home"),
    path("notes/", views.notes, name="notes"),
    path("auth/", views.auth, name="auth"),
]
