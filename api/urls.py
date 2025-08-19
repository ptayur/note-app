from django.urls import path
from .views import NoteView

urlpatterns = [
    path("notes/", NoteView.as_view()),
    path("notes/<int:pk>/", NoteView.as_view()),
]
