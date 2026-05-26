from rest_framework import viewsets
from ..authentication import CookieTokenAuthentication
from .permissions import IsAdminOrReadOnly  
from django.db.models import Q
from ..models import NAE
from ..serializers import NAESerializer

class NAEViewSet(viewsets.ModelViewSet):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = NAESerializer

    def get_queryset(self):
        queryset = NAE.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(codigo__icontains=search) |
                Q(actividad__icontains=search)
            )
        return queryset