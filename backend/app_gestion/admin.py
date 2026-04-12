from django.contrib import admin
from .models import (
    Organismo, Sector_economico, Provincia, Municipio,
    Entidad, Entidad_presupuestada, Entidad_empresarial,
    Director, Establecimiento, Servicio_electrico,
    NAE, Unidad_medida, Portador_energetico_elec
)


# Registro de modelos
admin.site.register(Organismo)
admin.site.register(Sector_economico)
admin.site.register(Provincia)
admin.site.register(Municipio)
admin.site.register(Entidad)
admin.site.register(Entidad_presupuestada)
admin.site.register(Entidad_empresarial)
admin.site.register(Director)
admin.site.register(Establecimiento)
admin.site.register(Servicio_electrico)
admin.site.register(NAE)
admin.site.register(Unidad_medida)
admin.site.register(Portador_energetico_elec)
