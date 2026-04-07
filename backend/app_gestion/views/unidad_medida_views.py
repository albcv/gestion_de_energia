from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..models import Unidad_medida
from ..serializers import UnidadMedidaSerializer

class UnidadMedidaViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UnidadMedidaSerializer

    def get_queryset(self):
        queryset = Unidad_medida.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(unidad__icontains=search)
        return queryset