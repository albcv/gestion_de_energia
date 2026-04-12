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
        municipio = self.request.query_params.get('municipio')
        tipo = self.request.query_params.get('tipo')
        codigo_reeup = self.request.query_params.get('codigo_REEUP')
        organismo = self.request.query_params.get('organismo')  # ← nuevo
        search = self.request.query_params.get('search')

        if municipio:
            queryset = queryset.filter(municipio__nombre__icontains=municipio)
        if tipo:
            if tipo == 'empresarial':
                queryset = queryset.filter(entidad_empresarial__isnull=False)
            elif tipo == 'presupuestada':
                queryset = queryset.filter(entidad_presupuestada__isnull=False)
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