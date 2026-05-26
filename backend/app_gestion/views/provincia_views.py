from rest_framework import viewsets
from ..authentication import CookieTokenAuthentication
from .permissions import IsAdminOrReadOnly  
from ..models import Provincia
from ..serializers import ProvinciaSerializer

class ProvinciaViewSet(viewsets.ModelViewSet):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = ProvinciaSerializer

    def get_queryset(self):
        queryset = Provincia.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(nombre__icontains=search)
        return queryset