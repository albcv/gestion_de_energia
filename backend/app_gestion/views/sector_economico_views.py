from django.db.models import Q
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..models import Sector_economico
from ..serializers import SectorEconomicoSerializer

class SectorEconomicoViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SectorEconomicoSerializer

    def get_queryset(self):
        queryset = Sector_economico.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(nombre__icontains=search)
        return queryset