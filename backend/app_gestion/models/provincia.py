from .base import TimeStampedModel
from django.db import models

class Provincia(TimeStampedModel):
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre")


    codigo_DPA = models.IntegerField(unique=True, verbose_name="Código DPA")

    class Meta:
        verbose_name = "Provincia"
        verbose_name_plural = "Provincias"

    def __str__(self):
        return self.nombre
