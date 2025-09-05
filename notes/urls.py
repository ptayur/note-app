from django.urls import path
from django.views.generic import TemplateView
from .views.note import NoteView


urlpatterns = [
    path("", TemplateView.as_view(template_name="notes/notes.html")),
    path("notes/", NoteView.as_view(), name="notes"),
]
