from rest_framework import viewsets
from ..authentication import CookieTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from ..models import Municipio
from ..serializers import MunicipioSerializer

class MunicipioViewSet(viewsets.ModelViewSet):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = MunicipioSerializer

    def get_queryset(self):
        queryset = Municipio.objects.select_related('provincia').all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(provincia__nombre__icontains=search)
            )
        return queryset