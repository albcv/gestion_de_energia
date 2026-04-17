from ..base import TimeStampedModel
from django.db import models
from django.core.exceptions import ValidationError

class Entidad(TimeStampedModel):
    nombre = models.CharField(max_length=200, verbose_name="Nombre", null=True, blank=True)
    siglas = models.CharField(max_length=20, verbose_name="Siglas", null=True, blank=True)
    telefono = models.CharField(max_length=20, verbose_name="Teléfono", null=True, blank=True)
    cuenta_bancaria = models.CharField(max_length=16, verbose_name="Cuenta bancaria", null=True, blank=True)
    codigo_REEUP = models.CharField(max_length=11, unique=True, verbose_name="Código REEUP")
    NIT = models.CharField(max_length=11,  verbose_name="NIT", null=True, blank=True)
    direccion = models.CharField(max_length=300,  verbose_name="Dirección", null=True, blank=True)
    geolocalizacion = models.CharField(max_length=200, verbose_name="Geolocalización (lat,lon)", null=True, blank=True)
    municipio = models.ForeignKey(
        'app_gestion.Municipio',
        on_delete=models.PROTECT,
        related_name='entidades',
        verbose_name="Municipio"
    )

    nae = models.ForeignKey(
        'app_gestion.NAE',
        on_delete=models.PROTECT,
        related_name='entidades',
        verbose_name="NAE",
        null=True,
        blank=True,
       
    )

    class Meta:
        verbose_name = "Entidad"
        verbose_name_plural = "Entidades"


    def __str__(self):
        return self.nombre