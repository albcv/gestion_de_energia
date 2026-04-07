from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ...models import Entidad_presupuestada
from ...serializers.entidad.entidad_presupuestada import EntidadPresupuestadaSerializer


class EntidadPresupuestadaViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Entidad_presupuestada.objects.all()
    serializer_class = EntidadPresupuestadaSerializer