from ..entidad.entidad import EntidadSerializer
from app_gestion.models import Entidad_empresarial

class EntidadEmpresarialSerializer(EntidadSerializer):
  
    class Meta:
        model = Entidad_empresarial
        fields = '__all__'
       



