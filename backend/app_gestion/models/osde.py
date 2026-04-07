from .base import TimeStampedModel
from django.db import models

class OSDE(TimeStampedModel):
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre")
    siglas = models.CharField(max_length=20, unique=True, verbose_name="Siglas")
    oace = models.ForeignKey(
        'app_gestion.OACE',
        on_delete=models.PROTECT,  # No se puede eliminar un OACE si tiene OSDE asociados
        null=True,
        blank=True,
        related_name='osdes',
        verbose_name="OACE que atiende"
    )


    descripcion = models.TextField(verbose_name="Descripción", blank=True, null=True)
    direccion_sede_principal = models.CharField(max_length=300, verbose_name="Dirección sede principal", blank=True, null=True)
    telefono_sede_principal = models.CharField(max_length=20, verbose_name="Teléfono sede principal", blank=True, null=True)

    class Meta:
        verbose_name = "OSDE"
        verbose_name_plural = "OSDE"

    def __str__(self):
        return self.nombre
