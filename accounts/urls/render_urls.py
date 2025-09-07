from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    # Render
    path("", TemplateView.as_view(template_name="accounts/auth.html")),
]
