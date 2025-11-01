from django.urls import path, include
from notes.views import NotesListView, NotesDetailView
from .share_urls import urlpatterns as shares_urls


urlpatterns = [
    path("", NotesListView.as_view(), name="notes-list"),
    path("<int:pk>/", NotesDetailView.as_view(), name="notes-detail"),
    path("<int:note_id>/shares/", include(shares_urls)),
]
