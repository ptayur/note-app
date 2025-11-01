from django.urls import path
from notes.views import SharesListView, SharesDetailView


urlpatterns = [
    path("", SharesListView.as_view(), name="shares-list"),
    path("<int:pk>/", SharesDetailView.as_view(), name="shares-detail"),
]
