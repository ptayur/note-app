from django.urls import path
from notes.views import ShareView


urlpatterns = [
    path("share/", ShareView.as_view()),
    path("share/<int:pk>/", ShareView.as_view()),
]
