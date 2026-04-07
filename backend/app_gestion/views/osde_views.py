from django.db.models import Q
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..models import OSDE
from ..serializers import OSDESerializer

class OSDEViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OSDESerializer

    def get_queryset(self):
        queryset = OSDE.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(siglas__icontains=search) |
                Q(oace__nombre__icontains=search) 
            )
        return queryset