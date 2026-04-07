from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Portador_energetico_elec
from ..serializers import PortadorEnergeticoElecSerializer

class PortadorEnergeticoElecViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PortadorEnergeticoElecSerializer

    def get_queryset(self):
        queryset = Portador_energetico_elec.objects.select_related('unidad_medida', 'servicio').all()
        anio = self.request.query_params.get('anio')
        mes = self.request.query_params.get('mes')
        servicio = self.request.query_params.get('servicio')
        search = self.request.query_params.get('search') 

        print("Parámetros recibidos:", anio, mes, servicio)  
        if anio:
            try:
                anio_int = int(anio)
                queryset = queryset.filter(año=anio_int)
            except ValueError:
                pass  

        if mes:
            try:
                mes_int = int(mes)
                queryset = queryset.filter(mes=mes_int)
            except ValueError:
                pass

        if servicio:
            try:
                servicio_int = int(servicio)
                queryset = queryset.filter(servicio__codigo_servicio=servicio_int)
            except ValueError:
                pass


        if search:
           
            queryset = queryset.filter(servicio__codigo_servicio__icontains=search)

        print("Número de resultados:", queryset.count())  
        return queryset.order_by('año', 'mes')

    @action(detail=False, methods=['get'])
    def anios_disponibles(self, request):
        """Devuelve una lista de años únicos ordenados."""
        anios = Portador_energetico_elec.objects.values_list('año', flat=True).distinct().order_by('año')
        return Response(list(anios))