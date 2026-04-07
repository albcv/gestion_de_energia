from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from ..models import Establecimiento
from ..serializers import EstablecimientoSerializer

class EstablecimientoViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = EstablecimientoSerializer

    def get_queryset(self):
        queryset = Establecimiento.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(servicio_electrico__codigo_servicio__icontains=search)  
            )
        return queryset