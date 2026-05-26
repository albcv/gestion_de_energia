from django.urls import include, path
from . import auth_urls, api_urls, consultas, bd_urls


urlpatterns = [
    path('', include(auth_urls)),
    path('', include(api_urls)),
    path('', include(consultas)),
    path('', include(bd_urls)),
]