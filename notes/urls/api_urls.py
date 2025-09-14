from django.urls import path
from ..views.note import NoteView, NoteListView
from ..views.shares import SharesView


urlpatterns = [
    path("", NoteListView.as_view(), name="notes"),
    path("<int:pk>/", NoteView.as_view()),
    path("shares/", SharesView.as_view()),
    path("shares/<int:pk>", SharesView.as_view()),
]
