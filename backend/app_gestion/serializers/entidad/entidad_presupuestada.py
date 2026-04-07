from ..entidad.entidad import EntidadSerializer
from app_gestion.models import Entidad_presupuestada

class EntidadPresupuestadaSerializer(EntidadSerializer):
  
    class Meta:
        model = Entidad_presupuestada
        fields = '__all__'


