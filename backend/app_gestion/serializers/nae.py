from .base import TimeStampedSerializer
from rest_framework import serializers
from app_gestion.models import NAE

class NAESerializer(TimeStampedSerializer):
    class Meta:
        model = NAE
        fields = '__all__'
