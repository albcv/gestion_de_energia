from .base import TimeStampedModel
from django.db import models

class Director(TimeStampedModel):
    nombre = models.CharField(max_length=50, verbose_name="Nombre")
    apellido1 = models.CharField(max_length=50, verbose_name="Primer apellido")
    apellido2 = models.CharField(max_length=50, blank=True, verbose_name="Segundo apellido")
    telefono = models.CharField(max_length=20, unique=True, verbose_name="Teléfono")
    correo = models.EmailField(unique=True, max_length=254, verbose_name="Correo electrónico")

    # Relación con Entidad (una entidad tiene un único director)
    entidad = models.OneToOneField(
        'app_gestion.Entidad',
        on_delete=models.CASCADE,
        related_name='director',
        verbose_name="Entidad"
    )

    class Meta:
        verbose_name = "Director"
        verbose_name_plural = "Directores"

    def __str__(self):
        return f"{self.nombre} {self.apellido1} {self.apellido2}".strip()