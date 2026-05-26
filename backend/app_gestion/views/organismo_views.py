from rest_framework import viewsets
from ..authentication import CookieTokenAuthentication
from .permissions import IsAdminOrReadOnly  
from django.db.models import Q
from ..models import Organismo
from ..serializers import OrganismoSerializer

class OrganismoViewSet(viewsets.ModelViewSet):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = OrganismoSerializer

    def get_queryset(self):
        queryset = Organismo.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(codigo__icontains=search) |
                Q(siglas__icontains=search)
            )
        return queryset.order_by('codigo') 