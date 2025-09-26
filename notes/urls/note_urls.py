from django.urls import path
from notes.views import NoteView


urlpatterns = [
    path("notes/", NoteView.as_view(), name="note-list"),
    path("notes/<int:pk>/", NoteView.as_view(), name="note-detail"),
]
