from ..base import TimeStampedModel
from django.db import models
from django.core.exceptions import ValidationError

class Entidad(TimeStampedModel):
    nombre = models.CharField(max_length=200, unique=True, verbose_name="Nombre")
    siglas = models.CharField(max_length=20, verbose_name="Siglas", null=True, blank=True)
    telefono = models.CharField(max_length=20, verbose_name="Teléfono", null=True, blank=True)
    cuenta_bancaria = models.CharField(max_length=16, verbose_name="Cuenta bancaria", null=True, blank=True)
    codigo_REEUP = models.CharField(max_length=11, unique=True, verbose_name="Código REEUP")
    NIT = models.CharField(max_length=11,  verbose_name="NIT", null=True, blank=True)
    direccion = models.CharField(max_length=300,  verbose_name="Dirección", null=True, blank=True)
    geolocalizacion = models.CharField(max_length=200, verbose_name="Geolocalización (lat,lon)", null=True, blank=True)
    ruta_documento_contrato_electrico = models.CharField(max_length=255, verbose_name="Ruta del contrato eléctrico", null=True, blank=True)
    municipio = models.ForeignKey(
        'app_gestion.Municipio',
        on_delete=models.PROTECT,
        related_name='entidades',
        verbose_name="Municipio"
    )

    # Relaciones
    oace = models.ForeignKey(
        'app_gestion.OACE',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='entidades',
        verbose_name="OACE (si pertenece a OACE)"
    )
    osde = models.ForeignKey(
        'app_gestion.OSDE',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='entidades',
        verbose_name="OSDE (si pertenece a OSDE)"
    )
    sector_economico = models.ForeignKey(
        'app_gestion.Sector_economico',
        on_delete=models.PROTECT,
        related_name='entidades',
        verbose_name="Sector económico",
        null=True,
        blank=True,
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

    def clean(self):
        # Validar que exactamente uno de oace u osde 
        if (self.oace and self.osde):
            raise ValidationError("La entidad debe pertenecer exactamente a un OACE o a un OSDE, no ambos")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre