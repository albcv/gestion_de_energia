from .base import TimeStampedModel
from django.db import models

class Sector_economico(TimeStampedModel):
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre")


    class Meta:
        verbose_name = "Sector económico"
        verbose_name_plural = "Sectores económicos"

    def __str__(self):
        return self.nombre