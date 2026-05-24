from django.urls import path
from ..views.consultas.consumo_por_mes import ConsumoPorMesView
from ..views.consultas.entidades_mayor_consumo import TopEntidadesConsumoView
from ..views.consultas.generar_pdf import GenerateReportPDFView

urlpatterns = [
   
    path('consultas/consumo-por-mes/', ConsumoPorMesView.as_view(), name='consumo-por-mes'),
    path('consultas/top-entidades/<int:anio>/', TopEntidadesConsumoView.as_view(), name='top_entidades'),
    path('generar-pdf/', GenerateReportPDFView.as_view(), name='generar_pdf'),
   
]