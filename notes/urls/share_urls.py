from django.urls import path
from notes.views import ShareListView, ShareDetailView


urlpatterns = [
    path("notes/<int:note_id>/shares/", ShareListView.as_view(), name="share-list"),
    path("shares/<int:pk>/", ShareDetailView.as_view(), name="share-detail"),
]
