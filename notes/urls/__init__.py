from .note_urls import urlpatterns as note_urls
from .share_urls import urlpatterns as share_urls
from .render_urls import urlpatterns as notes_render_urls

urlpatterns = note_urls + share_urls
