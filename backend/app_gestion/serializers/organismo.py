from .base import TimeStampedSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from app_gestion.models.organismo import Organismo

class OrganismoSerializer(TimeStampedSerializer):
    nombre = serializers.CharField(
        max_length=100,
        validators=[
            UniqueValidator(
                queryset=Organismo.objects.all(),
                message="Ya existe un organismo con este nombre."
            )
        ]
    )
   
    class Meta:
        model = Organismo
        fields = '__all__'

   