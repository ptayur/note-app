"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path, include
from django.views.generic import TemplateView
from notes.urls import urlpatterns as notes_urls, notes_render_urls
from accounts.urls import urlpatterns as accounts_urls, accounts_render_urls

api_v1_urlpatterns = [
    path("notes/", include(notes_urls)),
    path("users/", include(accounts_urls)),
]

urlpatterns = [
    path("", TemplateView.as_view(template_name="homepage.html")),  # Home render view
    path("notes/", include(notes_render_urls)),  # Notes render view
    path("auth/", include(accounts_render_urls)),  # Accounts render view
    path("api/v1/", include(api_v1_urlpatterns)),  # API v1
    path("__reload__/", include("django_browser_reload.urls")),
]
