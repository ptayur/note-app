from django.urls import path
from notes import views

urlpatterns = [
    path("", views.notes, name="notes"),
    path("get/", views.get_notes, name="get_notes"),
    path("add/", views.add_note, name="add_note"),
]
