from rest_framework import viewsets
from ...authentication import CookieTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ...models import Entidad_empresarial
from ...serializers.entidad.entidad_empresarial import EntidadEmpresarialSerializer


class EntidadEmpresarialViewSet(viewsets.ModelViewSet):
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Entidad_empresarial.objects.all()
    serializer_class = EntidadEmpresarialSerializer