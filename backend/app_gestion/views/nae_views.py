from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from ..models import NAE
from ..serializers import NAESerializer

class NAEViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
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