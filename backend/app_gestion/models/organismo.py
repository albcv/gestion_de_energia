from .base import TimeStampedModel
from django.db import models

class Organismo(TimeStampedModel):
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre")
    siglas = models.CharField(max_length=20, verbose_name="Siglas")
    codigo = models.CharField(max_length=3, unique=True, verbose_name="Código de organismo")

    class Meta:
        verbose_name = "Organismo"
        verbose_name_plural = "Organismos"

    def __str__(self):
        return self.nombre
