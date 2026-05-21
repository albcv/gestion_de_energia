from rest_framework import viewsets
from ...authentication import CookieTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ...models import Entidad_presupuestada
from ...serializers.entidad.entidad_presupuestada import EntidadPresupuestadaSerializer


class EntidadPresupuestadaViewSet(viewsets.ModelViewSet):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Entidad_presupuestada.objects.all()
    serializer_class = EntidadPresupuestadaSerializer