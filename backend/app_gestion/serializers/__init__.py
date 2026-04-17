from .user import UserSerializer
from .organismo import OrganismoSerializer
from .entidad.entidad import EntidadSerializer
from .entidad.entidad_empresarial import EntidadEmpresarialSerializer
from .entidad.entidad_presupuestada import EntidadPresupuestadaSerializer
from .director import DirectorSerializer
from .sector_economico import SectorEconomicoSerializer
from .establecimiento import EstablecimientoSerializer
from .municipio import MunicipioSerializer
from .provincia import ProvinciaSerializer
from .servicio_electrico import ServicioElectricoSerializer
from .nae import NAESerializer



__all__ = [
    'NAESerializer',
    'UserSerializer',
    'OrganismoSerializer',
    'EntidadSerializer',
    'EntidadEmpresarialSerializer',
    'EntidadPresupuestadaSerializer',
    'DirectorSerializer',
    'SectorEconomicoSerializer',
    'EstablecimientoSerializer',
    'MunicipioSerializer',
    'ProvinciaSerializer',
    'ServicioElectricoSerializer',
   
    
]
