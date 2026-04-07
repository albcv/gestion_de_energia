from django.urls import include, path
from . import auth_urls, api_urls, consultas

urlpatterns = [
    path('', include(auth_urls)),
    path('', include(api_urls)),
    path('', include(consultas)),
]