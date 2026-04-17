from .base import TimeStampedSerializer
from rest_framework import serializers
from app_gestion.models import Servicio_electrico

class ServicioElectricoSerializer(TimeStampedSerializer):
    mes_nombre = serializers.SerializerMethodField()
    entidad_nombre = serializers.CharField(source="entidad.nombre", read_only=True)
    codigo_REEUP = serializers.CharField(source="entidad.codigo_REEUP", read_only=True)

    class Meta:
        model = Servicio_electrico
        fields = '__all__'

    def get_mes_nombre(self, obj):
        # Mapeo de números a nombres de meses en español
        meses = [
            '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ]
        return meses[obj.mes] if 1 <= obj.mes <= 12 else ''