from .base import TimeStampedSerializer
from rest_framework import serializers
from app_gestion.models import Unidad_medida

class UnidadMedidaSerializer(TimeStampedSerializer):
    class Meta:
        model = Unidad_medida
        fields = '__all__'
