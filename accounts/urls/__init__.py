from .auth_urls import urlpatterns as api_urls
from .render_urls import urlpatterns as accounts_render_urls

urlpatterns = auth_urls
