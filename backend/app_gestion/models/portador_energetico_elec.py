from .base import TimeStampedModel
from django.db import models

class Portador_energetico_elec(TimeStampedModel):
    consumo_planificado = models.FloatField(verbose_name="Consumo planificado", null=True, blank=True)
    consumo_real = models.FloatField(verbose_name="Consumo real")
    mes = models.IntegerField()
    año = models.IntegerField()

    servicio = models.ForeignKey(
        'app_gestion.Servicio_electrico',
        on_delete=models.CASCADE,
        related_name='portadores',
        verbose_name="Servicio eléctrico"
    )

    unidad_medida = models.ForeignKey(
        'app_gestion.Unidad_medida',
        on_delete=models.PROTECT,
        related_name='portadores',
        verbose_name="Unidad de medida"
    )

    class Meta:
        indexes = [
            models.Index(fields=['año']),
            models.Index(fields=['mes']),
            models.Index(fields=['año', 'mes']),
            models.Index(fields=['servicio', 'año', 'mes']), 
        ]
        unique_together = ('servicio', 'año', 'mes')
        verbose_name = "Portador energético de electricidad"
        verbose_name_plural = "Portadores energéticos de electricidad"

    def __str__(self):
        return f"Portador {self.servicio.codigo_servicio}"