from .base import TimeStampedModel
from django.db import models

class Establecimiento(TimeStampedModel):
    nombre = models.CharField(max_length=200, unique=True, verbose_name="Nombre")
    direccion = models.CharField(max_length=300, unique=True, verbose_name="Dirección")
    geolocalizacion = models.CharField(
        max_length=200,
        unique=True,
        verbose_name="Geolocalización (lat,lon)",
        null=True,
        blank=True,
    )
     
    servicio_electrico = models.ForeignKey(
        "app_gestion.Servicio_electrico",
        on_delete=models.CASCADE,
        related_name="establecimientos",
        verbose_name="Servicio eléctrico"
    )

    municipio = models.ForeignKey('app_gestion.Municipio',
        on_delete=models.PROTECT,  # No se puede eliminar un municipio con establecimientos
        related_name='establecimientos',
        verbose_name="Municipio"
    )

    class Meta:
        verbose_name = "Establecimiento"
        verbose_name_plural = "Establecimientos"

    def __str__(self):
        return self.nombre
