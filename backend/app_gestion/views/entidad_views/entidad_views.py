from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from ...models import Entidad
from ...serializers import EntidadSerializer

class EntidadViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = EntidadSerializer

    def get_queryset(self):
        queryset = Entidad.objects.all()
        # Obtener parámetros de consulta
        municipio = self.request.query_params.get('municipio')
        tipo = self.request.query_params.get('tipo')
        sector = self.request.query_params.get('sector')
        codigo_reeup = self.request.query_params.get('codigo_REEUP')
        search = self.request.query_params.get('search')

        if municipio:
            queryset = queryset.filter(municipio__nombre__icontains=municipio)
        if tipo:
            if tipo == 'empresarial':
                queryset = queryset.filter(entidad_empresarial__isnull=False)
            elif tipo == 'presupuestada':
                queryset = queryset.filter(entidad_presupuestada__isnull=False)
        if sector:
            queryset = queryset.filter(sector_economico__nombre__icontains=sector)
        if codigo_reeup:
            queryset = queryset.filter(codigo_REEUP__icontains=codigo_reeup)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(codigo_REEUP__icontains=search) |
                Q(sector_economico__nombre__icontains=search) |
                Q(municipio__nombre__icontains=search)
            )
        # Ordenar por municipio
        return queryset.order_by('municipio__nombre')