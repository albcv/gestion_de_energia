from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ...models import Entidad_empresarial
from ...serializers.entidad.entidad_empresarial import EntidadEmpresarialSerializer


class EntidadEmpresarialViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Entidad_empresarial.objects.all()
    serializer_class = EntidadEmpresarialSerializer