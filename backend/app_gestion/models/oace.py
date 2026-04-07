from .base import TimeStampedModel
from django.db import models

class OACE(TimeStampedModel):
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre")
    siglas = models.CharField(max_length=20, unique=True, verbose_name="Siglas")


    descripcion = models.TextField(verbose_name="Descripción", blank=True, null=True)
    direccion_sede_principal = models.CharField(max_length=300, verbose_name="Dirección sede principal", blank=True, null=True)
    telefono_sede_principal = models.CharField(max_length=20, verbose_name="Teléfono sede principal", blank=True, null=True)

    class Meta:
        verbose_name = "OACE"
        verbose_name_plural = "OACE"

    def __str__(self):
        return self.nombre
