from django.urls import path
from notes.views import NotesListView, NotesDetailView


urlpatterns = [
    path("notes/", NotesListView.as_view(), name="notes-list"),
    path("notes/<int:pk>/", NotesDetailView.as_view(), name="notes-detail"),
]
