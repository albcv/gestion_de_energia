from django.urls import path
from ..views.bd_views import realizar_backup


urlpatterns = [
   
    path('backup/', realizar_backup, name='backup'),
    
]