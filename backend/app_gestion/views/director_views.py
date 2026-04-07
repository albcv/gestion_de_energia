from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from ..models import Director
from ..serializers import DirectorSerializer

class DirectorViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = DirectorSerializer

    def get_queryset(self):
        queryset = Director.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(apellido1__icontains=search) |
                Q(apellido2__icontains=search) |
                Q(telefono__icontains=search) |
                Q(correo__icontains=search) |
                Q(entidad__nombre__icontains=search)
            )
        return queryset