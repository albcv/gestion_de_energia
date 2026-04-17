from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from ..models import Servicio_electrico
from ..serializers import ServicioElectricoSerializer

class ServicioElectricoViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ServicioElectricoSerializer

    def get_queryset(self):
        queryset = Servicio_electrico.objects.select_related('entidad').all()

        # Búsqueda general (texto)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(codigo_servicio__icontains=search) |
                Q(tarifa_contratada__icontains=search) |
                Q(entidad__nombre__icontains=search) |
                Q(entidad__codigo_REEUP__icontains=search)
            )

        # Filtros específicos
        codigo_servicio = self.request.query_params.get('codigo_servicio')
        if codigo_servicio:
            queryset = queryset.filter(codigo_servicio=codigo_servicio)

        mes = self.request.query_params.get('mes')
        if mes:
            queryset = queryset.filter(mes=mes)

        año = self.request.query_params.get('año')
        if año:
            queryset = queryset.filter(año=año)

        codigo_REEUP = self.request.query_params.get('codigo_REEUP')
        if codigo_REEUP:
            queryset = queryset.filter(entidad__codigo_REEUP__icontains=codigo_REEUP)

        return queryset.order_by('mes', 'año')

    @action(detail=False, methods=['get'], url_path='anios-disponibles')
    def anios_disponibles(self, request):
        """
        Devuelve los años únicos presentes en los servicios eléctricos.
        """
        años = (
            Servicio_electrico.objects
            .values_list('año', flat=True)
            .distinct()
            .order_by('-año')
        )
        return Response(list(años))