from .base import TimeStampedModel
from django.db import models

class Municipio(TimeStampedModel):
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre")
    provincia = models.ForeignKey(
        'app_gestion.Provincia',
        on_delete=models.PROTECT,
        related_name='municipios',
        verbose_name="Provincia"
    )
    codigo_DPA = models.CharField(max_length=2, verbose_name="Código DPA")

    class Meta:
        verbose_name = "Municipio"
        verbose_name_plural = "Municipios"
        constraints = [
            models.UniqueConstraint(
                fields=['provincia', 'codigo_DPA'],
                name='unique_municipio_por_provincia'
            )
        ]

    def __str__(self):
        return self.nombre