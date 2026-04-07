from .base import TimeStampedModel
from django.db import models

class Unidad_medida(TimeStampedModel):
    unidad = models.CharField(max_length=20, unique=True, verbose_name="Unidad")

    class Meta:
        verbose_name = "Unidad de medida"
        verbose_name_plural = "Unidades de medida"

    def __str__(self):
        return self.unidad
