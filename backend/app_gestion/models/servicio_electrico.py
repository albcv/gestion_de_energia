from .base import TimeStampedModel
from django.db import models

class Servicio_electrico(TimeStampedModel):
   
    codigo_servicio = models.IntegerField(verbose_name="Código de servicio") 
    mes = models.IntegerField()
    año = models.IntegerField()
    consumo_real = models.FloatField(verbose_name="Consumo real")
    tarifa_contratada = models.CharField(verbose_name="Tarifa contratada")
    demanda_contratada = models.FloatField(verbose_name="Demanda contratada")
    regimen_trabajo = models.IntegerField(verbose_name="Régimen de trabajo")

    entidad = models.ForeignKey(
        'app_gestion.Entidad',
        on_delete=models.CASCADE,
        related_name='servicios_electricos',
        verbose_name="Entidad"
    )

    class Meta:
        verbose_name = "Servicio eléctrico"
        verbose_name_plural = "Servicios eléctricos"
        constraints = [
            models.UniqueConstraint(
                fields=['codigo_servicio', 'mes', 'año'],
                name='unique_servicio_mes_año'
            )
        ]

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.codigo_servicio)