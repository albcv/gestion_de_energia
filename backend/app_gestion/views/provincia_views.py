from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..models import Provincia
from ..serializers import ProvinciaSerializer

class ProvinciaViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProvinciaSerializer

    def get_queryset(self):
        queryset = Provincia.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(nombre__icontains=search)
        return queryset