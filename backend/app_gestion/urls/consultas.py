from django.urls import path
from ..views.consultas.consumo_por_mes import ConsumoPorMesView

urlpatterns = [
   
    path('consultas/consumo-por-mes/', ConsumoPorMesView.as_view(), name='consumo-por-mes'),
]