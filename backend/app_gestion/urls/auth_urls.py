from django.urls import path
from ..views import auth_views

urlpatterns = [
    path('login/', auth_views.login, name='login'),
    path('logout/', auth_views.logout, name='logout'),
    path('perfil/', auth_views.perfil_usuario, name='perfil'),
    path('cambiar-password/', auth_views.cambiar_password, name='cambiar_password'),
    path('csrf/',  auth_views.set_csrf_cookie, name='csrf'),
]