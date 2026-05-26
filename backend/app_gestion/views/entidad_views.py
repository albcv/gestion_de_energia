from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Sum, Count
import calendar

from ..authentication import CookieTokenAuthentication
from .permissions import IsAdminOrReadOnly   
from ..models import Entidad, Servicio_electrico
from ..serializers import EntidadSerializer, ServicioElectricoSerializer


class EntidadViewSet(viewsets.ModelViewSet):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAdminOrReadOnly]          
    serializer_class = EntidadSerializer

    def get_queryset(self):
        queryset = Entidad.objects.all()
        municipio = self.request.query_params.get('municipio')
        tipo = self.request.query_params.get('tipo')
        codigo_reeup = self.request.query_params.get('codigo_REEUP')
        organismo = self.request.query_params.get('organismo')
        search = self.request.query_params.get('search')

        if municipio:
            queryset = queryset.filter(municipio__nombre__icontains=municipio)
        if tipo:
            queryset = queryset.filter(tipo=tipo)
        if codigo_reeup:
            queryset = queryset.filter(codigo_REEUP__icontains=codigo_reeup)
        if organismo:
            queryset = queryset.filter(
                Q(codigo_REEUP__startswith=f"{organismo}.")
            )
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(codigo_REEUP__icontains=search) |
                Q(municipio__nombre__icontains=search)
            )
        return queryset.order_by('municipio__nombre')

    # ------- Acciones de solo lectura -------
    @action(detail=True, methods=['get'], url_path='servicios-electricos')
    def servicios_electricos(self, request, pk=None):
        entidad = self.get_object()
        servicios = entidad.servicios_electricos.all()
        serializer = ServicioElectricoSerializer(servicios, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='anios-disponibles')
    def anios_disponibles_entidad(self, request, pk=None):
        entidad = self.get_object()
        anios = Servicio_electrico.objects.filter(
            entidad=entidad
        ).values_list('año', flat=True).distinct().order_by('-año')
        return Response(list(anios))

    @action(detail=True, methods=['get'], url_path='consumo-por-mes')
    def consumo_por_mes_entidad(self, request, pk=None):
        try:
            entidad = Entidad.objects.get(pk=pk)
        except Entidad.DoesNotExist:
            return Response({"error": "Entidad no encontrada"}, status=404)

        anio_param = request.query_params.get('anio')
        unidad = request.query_params.get('unidad', 'kWh').upper()

        if not anio_param:
            return Response({"error": "Falta el parámetro 'anio'"}, status=400)
        try:
            anio = int(anio_param)
        except ValueError:
            return Response({"error": "Año inválido"}, status=400)

        if unidad not in ('KWH', 'MWH', 'GWH'):
            unidad = 'KWH'

        resultado = []
        for mes_visual in range(1, 13):
            if mes_visual == 12:
                año_real = anio + 1
                mes_real = 1
            else:
                año_real = anio
                mes_real = mes_visual + 1

            total_kwh = (
                Servicio_electrico.objects
                .filter(entidad=entidad, año=año_real, mes=mes_real)
                .aggregate(total=Sum('consumo_real'))['total'] or 0
            )

            if unidad == 'MWH':
                total = total_kwh / 1000.0
            elif unidad == 'GWH':
                total = total_kwh / 1_000_000.0
            else:
                total = total_kwh

            resultado.append({
                'mes': mes_visual,
                'mes_nombre': calendar.month_name[mes_visual],
                'total': total
            })
        return Response(resultado)

    @action(detail=False, methods=['get'], url_path='sin_servicio')
    def sin_servicio(self, request):
        entidades = self.get_queryset().annotate(
            num_servicios=Count('servicios_electricos')
        ).filter(num_servicios=0)
        serializer = self.get_serializer(entidades, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='sin_nombre')
    def sin_nombre(self, request):
        entidades = self.get_queryset().filter(Q(nombre__isnull=True) | Q(nombre=''))
        serializer = self.get_serializer(entidades, many=True)
        return Response(serializer.data)