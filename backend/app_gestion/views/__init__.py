from .auth_views import login, logout, perfil_usuario, cambiar_password
from .organismo_views import OrganismoViewSet
from .entidad_views import EntidadViewSet
from .director_views import DirectorViewSet
from .municipio_views import MunicipioViewSet
from .provincia_views import ProvinciaViewSet
from .servicio_electrico_views import ServicioElectricoViewSet
from .nae_views import NAEViewSet
from .consultas.consumo_por_mes import ConsumoPorMesView
from .consultas.entidades_mayor_consumo import TopEntidadesConsumoView
__all__ = [
    'NAEViewSet',
    'login',
    'logout',
    'perfil_usuario',
    'cambiar_password',
    'OrganismoViewSet',
    'EntidadViewSet',
    'DirectorViewSet',
    'MunicipioViewSet',
    'ProvinciaViewSet',
    'ServicioElectricoViewSet',
    'ConsumoPorMesView',
    'TopEntidadesConsumoView',
  
    
   
]
