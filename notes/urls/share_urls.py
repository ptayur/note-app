from django.urls import path
from notes.views import ShareView, ShareNoteView


urlpatterns = [
    path("notes/<int:note_id>/shares/", ShareNoteView.as_view(), name="share-list"),
    path("shares/<int:pk>/", ShareView.as_view(), name="share-detail"),
]
