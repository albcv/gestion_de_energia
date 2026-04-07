from .base import TimeStampedModel
from django.db import models

class NAE(TimeStampedModel):
    codigo = models.CharField(max_length=4, unique=True, verbose_name="Código (4 dígitos)")
    actividad = models.TextField(verbose_name="Actividad")

    class Meta:
        verbose_name = "NAE"
        verbose_name_plural = "NAE"

    def __str__(self):
        return f"{self.codigo} - {self.actividad}"
