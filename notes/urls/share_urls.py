from django.urls import path
from notes.views import SharesListView, SharesDetailView


urlpatterns = [
    path("notes/<int:note_id>/shares/", SharesListView.as_view(), name="shares-list"),
    path("shares/<int:pk>/", SharesDetailView.as_view(), name="shares-detail"),
]
