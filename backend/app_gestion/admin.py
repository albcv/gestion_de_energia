from django.contrib import admin
from .models import (
    Organismo, Provincia, Municipio,
    Entidad, Director, Servicio_electrico,
    NAE
)


# Registro de modelos
admin.site.register(Organismo)
admin.site.register(Provincia)
admin.site.register(Municipio)
admin.site.register(Entidad)
admin.site.register(Director)
admin.site.register(Servicio_electrico)
admin.site.register(NAE)

