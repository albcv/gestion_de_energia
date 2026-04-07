from .base import TimeStampedSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from app_gestion.models import Portador_energetico_elec
import datetime

class PortadorEnergeticoElecSerializer(TimeStampedSerializer):
    servicio_codigo = serializers.IntegerField(source='servicio.codigo_servicio', read_only=True)
    unidad_medida_nombre = serializers.SerializerMethodField()
    consumo_real_con_unidad = serializers.SerializerMethodField()
    mes_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Portador_energetico_elec
        fields = '__all__'
        validators = [
            UniqueTogetherValidator(
                queryset=Portador_energetico_elec.objects.all(),
                fields=('servicio', 'año', 'mes'),
                message="Ya existe un portador para este servicio en el mismo mes y año."
            )
        ]

    def validate_mes(self, value):
        if value < 1 or value > 12:
            raise serializers.ValidationError("El mes debe estar entre 1 y 12.")
        return value

    def validate_año(self, value):
        current_year = datetime.datetime.now().year
        if value < 2000 or value > current_year:
            raise serializers.ValidationError(f"El año debe estar entre 2000 y {current_year}.")
        return value

    def validate_consumo_real(self, value):
        if value < 0:
            raise serializers.ValidationError("El consumo real no puede ser negativo.")
        return value

    def validate_consumo_planificado(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("El consumo planificado no puede ser negativo.")
        return value

    def get_unidad_medida_nombre(self, obj):
        """Retorna el nombre de la unidad de medida o None si no existe."""
        if obj.unidad_medida:
            return obj.unidad_medida.unidad
        return None

    def get_consumo_real_con_unidad(self, obj):
        """Retorna el consumo real con su unidad si existe, solo el número si no."""
        if obj.unidad_medida:
            return f"{obj.consumo_real} {obj.unidad_medida.unidad}"
        return str(obj.consumo_real)  # o f"{obj.consumo_real} (sin unidad)" si prefieres

    def get_mes_nombre(self, obj):
        meses = {
            1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
            5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
            9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
        }
        return meses.get(obj.mes, '')