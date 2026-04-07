from .base import TimeStampedSerializer
from rest_framework import serializers
from app_gestion.models import Establecimiento

class EstablecimientoSerializer(TimeStampedSerializer):
    municipio_nombre = serializers.CharField(source='municipio.nombre', read_only=True)
    provincia_nombre = serializers.CharField(source='municipio.provincia.nombre', read_only=True)

    servicio_codigo = serializers.IntegerField(source="servicio_electrico.codigo_servicio", read_only=True)

    class Meta:
        model = Establecimiento
        fields = '__all__'
        
