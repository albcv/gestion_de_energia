from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from ..models import Servicio_electrico
from ..serializers import ServicioElectricoSerializer

class ServicioElectricoViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ServicioElectricoSerializer

    def get_queryset(self):
        queryset = Servicio_electrico.objects.select_related('entidad').all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(codigo_servicio__icontains=search) |
                Q(tarifa_contratada__icontains=search) |
                Q(entidad__nombre__icontains=search)
            )
        return queryset.order_by('entidad__nombre')