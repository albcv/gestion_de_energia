from django.urls import path
from ..views.consultas.consumo_por_mes import ConsumoPorMesView
from ..views.consultas.entidades_mayor_consumo import TopEntidadesConsumoView

urlpatterns = [
   
    path('consultas/consumo-por-mes/', ConsumoPorMesView.as_view(), name='consumo-por-mes'),
    path('consultas/top-entidades/<int:anio>/', TopEntidadesConsumoView.as_view(), name='top_entidades'),
   
]