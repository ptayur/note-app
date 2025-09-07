from django.urls import path
from ..views.note import NoteView


urlpatterns = [path("", NoteView.as_view(), name="notes"), path("<int:pk>/", NoteView.as_view())]
