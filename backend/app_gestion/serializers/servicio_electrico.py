from .base import TimeStampedSerializer
from rest_framework import serializers
from app_gestion.models import Servicio_electrico

class ServicioElectricoSerializer(TimeStampedSerializer):

    entidad_nombre = serializers.CharField(source="entidad.nombre", read_only=True)

    class Meta:
        model = Servicio_electrico
        fields = '__all__'
